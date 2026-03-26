import HomeSliderModel from "../models/homeSlider.model.js";

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
export async function uploadImages(request, response) {
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

//create homeSlide
export async function addHomeSlide(request, response) {
    try {
        let homeSlide = new HomeSliderModel({
            images: imagesArr
        })

        if (!homeSlide) {
            return response.status(500).json({
                message: "Slide not created",
                error: true,
                success: false
            })
        }

        homeSlide = await homeSlide.save()

        imagesArr = []

        return response.status(200).json({
            message: "Slide created",
            error: false,
            success: true,
            homeSlide: homeSlide
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//get slide
export async function getHomeSlides(request, response) {
    try {
        const slides = await HomeSliderModel.find()

        if (!slides) {
            return response.status(404).json({
                message: "Slide not found",
                error: true,
                success: false
            })
        }

        return response.status(200).json({
            error: false,
            success: true,
            data: slides
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}


export async function getSlide(request, response) {
    try {
        const slide = await HomeSliderModel.findById(request.params.id)

        if (!slide) {
            return response.status(404).json({
                message: "Slide not found",
                error: true,
                success: false
            })
        }

        return response.status(200).json({
            error: false,
            success: true,
            data: slide
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//delete the image
export async function removeImageFromCloudinary(request, response) {
    const imgUrl = request.query.img;
    const urlArr = imgUrl.split("/");
    const image = urlArr[urlArr.length - 1];

    const imageName = image.split(".")[0];

    if (imageName) {
        const res = await cloudinary.uploader.destroy(
            imageName,
            (error, result) => {
                // console.log(error,res)
            }
        )

        if (res) {
            return response.status(200).json({
                error: true,
                success: true,
                message: "Image deleted successfully"
            });
        }
    }
}

export async function deleteSlide(request, response) {
    try {
        const slide = await HomeSliderModel.findById(request.params.id)
        const images = slide.images;

        let img = ""
        for (img of images) {
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

        // Delete the main slide
        const deletedSlide = await HomeSliderModel.findByIdAndDelete(request.params.id)

        if (!deletedSlide) {
            return response.status(400).json({
                message: "Slide not found",
                success: false,
                error: true
            })
        }

        return response.status(200).json({
            message: "Slide Deleted!",
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

export async function updatedSlide(request, response) {
    try {
        //console.log(imagesArr)
        const slide = await HomeSliderModel.findByIdAndUpdate(
            request.params.id,
            {
                images: imagesArr.length > 0 ? imagesArr[0] : request.body.images,
            },
            { new: true }
        )

        if (!slide) {
            return response.status(500).json({
                message: "Slide cannot be updated!",
                success: false,
                error: true
            })
        }
        imagesArr = []

        response.status(200).json({
            success: true,
            error: false,
            slide: slide
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//delete multiple Slides 
export async function deleteMultipleSlide(request, response) {
    try {
        const { ids } = request.body;

        if (!ids || !Array.isArray(ids)) {
            return response.status(400).json({
                error: true,
                success: false,
                message: "Invalid input"
            });
        }
        for (let i = 0; i < ids?.length; i++) {
            const slide = await HomeSliderModel.findById(ids[i])
            const images = slide.images;

            let img = ""
            for (img of images) {
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
        }

        // Delete products from DB
        await HomeSliderModel.deleteMany({
            _id: { $in: ids }
        });

        return response.status(200).json({
            message: "Slides deleted successfully",
            success: true,
            error: false
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            success: false,
            error: true
        });
    }
}