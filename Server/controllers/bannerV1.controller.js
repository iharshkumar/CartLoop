import BannerV1Model from "../models/bannerV1.model.js"

import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.cloudinary_Config_Cloud_name,
    api_key: process.env.cloudinary_Config_api_key,
    api_secret: process.env.cloudinary_api_secret,
    secure: true,
})


//image upload
var imagesArr = []
export async function uploadBannerImages(request, response) {
    try {
        imagesArr = [];

        const image = request.files;

        const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: false
        };

        for (let i = 0; i < request?.files?.length; i++) {
            const file = request.files[i];
            const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
            await cloudinary.uploader.upload(
                dataUri,
                options,
                function (error, result) {
                    if (result) {
                        imagesArr.push(result.secure_url);
                    }
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

//add banner
export async function addBanner(request, response) {
    try {
        let banner = new BannerV1Model({
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
                message: "Banner not created",
                error: true,
                success: false
            })
        }

        banner = await banner.save()

        imagesArr = []

        return response.status(200).json({
            message: "Banner created",
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

//get banners
export async function getBanners(request, response) {
    try {
        const banners = await BannerV1Model.find()
        if (!banners) {
            return response.status(500).json({
                message: "Banners not found",
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

export async function deleteBanner(request, response) {
    try {
        const banner = await BannerV1Model.findById(request.params.id)

        if (!banner) {
            return response.status(400).json({
                message: "Banner not found",
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
        const deletedBanner = await BannerV1Model.findByIdAndDelete(request.params.id)

        if (!deletedBanner) {
            return response.status(400).json({
                message: "Banner not found",
                success: false,
                error: true
            })
        }

        return response.status(200).json({
            message: "Banner Deleted!",
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

export async function updatedBanner(request, response) {
    try {
        const banner = await BannerV1Model.findByIdAndUpdate(
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
                message: "Banner cannnot be updated!",
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

//get single banner
export async function getBanner(request, response) {
    try {
        const banner = await BannerV1Model.findById(request.params.id)

        if (!banner) {
            return response.status(500).json({
                message: "The banner with the given ID was not found",
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