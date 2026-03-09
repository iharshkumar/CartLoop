import BannerV2Model from "../models/bannerV2.model.js"
import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.cloudinary_Config_Cloud_name,
    api_key: process.env.cloudinary_Config_api_key,
    api_secret: process.env.cloudinary_api_secret,
    secure: true,
})

// image upload
var imagesArr = []
export async function uploadBannerV2Images(request, response) {
    try {
        imagesArr = [];

        const image = request.files;

        const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: false
        };

        for (let i = 0; i < request?.files?.length; i++) {
            await cloudinary.uploader.upload(
                image[i].path,
                options,
                function (error, result) {
                    if (error) {
                        console.error(error);
                        return;
                    }
                    imagesArr.push(result.secure_url);
                    fs.unlinkSync(`uploads/${request.files[i].filename}`)
                }
            )
        }

        return response.status(200).json({
            images: imagesArr
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

// add banner V2
export async function addBannerV2(request, response) {
    try {
        let banner = new BannerV2Model({
            bannerTitle: request.body.bannerTitle,
            images: imagesArr,
            catId: request.body.catId,
            subCatId: request.body.subCatId,
            thirdsubCatId: request.body.thirdsubCatId,
            price: request.body.price,
            alignInfo: request.body.alignInfo
        })

        if (!banner) {
            return response.status(500).json({
                message: "Banner V2 not created",
                error: true,
                success: false
            })
        }

        banner = await banner.save()
        imagesArr = []

        return response.status(200).json({
            message: "Banner V2 created",
            error: false,
            success: true,
            banner: banner
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

// get banners V2
export async function getBannersV2(request, response) {
    try {
        const banners = await BannerV2Model.find()
        if (!banners) {
            return response.status(500).json({
                message: "Banners V2 not found",
                error: true,
                success: false
            })
        }

        return response.status(200).json({
            error: false,
            success: true,
            data: banners
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

// delete banner V2
export async function deleteBannerV2(request, response) {
    try {
        const banner = await BannerV2Model.findById(request.params.id)

        if (!banner) {
            return response.status(400).json({
                message: "Banner V2 not found",
                success: false,
                error: true
            })
        }

        // Delete images from Cloudinary first
        const images = banner.images || [];
        for (const img of images) {
            const imgUrl = img;
            const urlArr = imgUrl.split("/")
            const image = urlArr[urlArr.length - 1]
            const imageName = image.split(".")[0]

            if (imageName) {
                try {
                    await cloudinary.uploader.destroy(imageName)
                } catch (cloudinaryError) {
                    console.error("Error deleting image from Cloudinary:", cloudinaryError)
                }
            }
        }

        // Delete the main banner
        const deletedBanner = await BannerV2Model.findByIdAndDelete(request.params.id)

        if (!deletedBanner) {
            return response.status(400).json({
                message: "Banner V2 not found",
                success: false,
                error: true
            })
        }

        return response.status(200).json({
            message: "Banner V2 Deleted!",
            success: true,
            error: false
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

// update banner V2
export async function updatedBannerV2(request, response) {
    try {
        const banner = await BannerV2Model.findByIdAndUpdate(
            request.params.id,
            {
                bannerTitle: request.body.bannerTitle,
                images: imagesArr.length > 0 ? imagesArr[0] : request.body.images,
                catId: request.body.catId,
                subCatId: request.body.subCatId,
                thirdsubCatId: request.body.thirdsubCatId,
                price: request.body.price,
                alignInfo: request.body.alignInfo
            },
            { new: true }
        )

        if (!banner) {
            return response.status(500).json({
                message: "Banner V2 cannot be updated!",
                success: false,
                error: true
            })
        }
        imagesArr = [];

        return response.status(200).json({
            success: true,
            error: false,
            banner: banner
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

// get single banner V2
export async function getBannerV2(request, response) {
    try {
        const banner = await BannerV2Model.findById(request.params.id)

        if (!banner) {
            return response.status(500).json({
                message: "The Banner V2 with the given ID was not found",
                error: true,
                success: false
            })
        }
        return response.status(200).json({
            error: false,
            success: true,
            banner: banner
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

