import AdsBannerV1Model from "../models/adsBannerV1.model.js";
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
export async function uploadAdsBannerV1Images(request, response) {
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

// create AdsBanner V1
export async function addAdsBannerV1(request, response) {
    try {
        let banner = new AdsBannerV1Model({
            images: imagesArr
        })

        if (!banner) {
            return response.status(500).json({
                message: "Ads Banner V1 not created",
                error: true,
                success: false
            })
        }

        banner = await banner.save()
        imagesArr = []

        return response.status(200).json({
            message: "Ads Banner V1 created",
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

// get all AdsBanner V1
export async function getAdsBannerV1(request, response) {
    try {
        const banners = await AdsBannerV1Model.find()
        if (!banners) {
            return response.status(404).json({
                message: "Ads Banner V1 not found",
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

// delete single AdsBanner V1
export async function deleteAdsBannerV1(request, response) {
    try {
        const banner = await AdsBannerV1Model.findById(request.params.id)

        if (!banner) {
            return response.status(400).json({
                message: "Ads Banner V1 not found",
                success: false,
                error: true
            })
        }

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

        const deletedBanner = await AdsBannerV1Model.findByIdAndDelete(request.params.id)

        if (!deletedBanner) {
            return response.status(400).json({
                message: "Ads Banner V1 not found",
                success: false,
                error: true
            })
        }

        return response.status(200).json({
            message: "Ads Banner V1 Deleted!",
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

// update AdsBanner V1 (replace images)
export async function updateAdsBannerV1(request, response) {
    try {
        const banner = await AdsBannerV1Model.findByIdAndUpdate(
            request.params.id,
            {
                images: imagesArr.length > 0 ? imagesArr : request.body.images,
            },
            { new: true }
        )

        if (!banner) {
            return response.status(500).json({
                message: "Ads Banner V1 cannot be updated!",
                success: false,
                error: true
            })
        }
        imagesArr = []

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

// get single AdsBanner V1
export async function getSingleAdsBannerV1(request, response) {
    try {
        const banner = await AdsBannerV1Model.findById(request.params.id)

        if (!banner) {
            return response.status(404).json({
                message: "Ads Banner V1 not found",
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

