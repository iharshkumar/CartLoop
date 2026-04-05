import BlogModel from "../models/blog.model.js";
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

//create blog
export async function addBlog(request, response) {
    try {
        let blog = new BlogModel({
            images: imagesArr,
            title: request.body.title,
            description: request.body.description
        })

        if (!blog) {
            return response.status(500).json({
                message: "Blog not created",
                error: true,
                success: false
            })
        }

        blog = await blog.save()

        imagesArr = []

        return response.status(200).json({
            message: "Blog created",
            error: false,
            success: true,
            blog: blog
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//get Blog
export async function getBlogs(request, response) {
    try {
        const page = parseInt(request.query.page) || 1;
        const perPage = parseInt(request.query.perPage) || 10;
        const totalPosts = await BlogModel.countDocuments();
        const totalPages = Math.ceil(totalPosts / perPage) || 1;

        if (page > totalPages && totalPosts > 0) {
            return response.status(404).json({
                message: "Page not found",
                error: true,
                success: false
            })
        }

        const blogs = await BlogModel.find()
            .skip(Math.max(0, (page - 1) * perPage))
            .limit(Math.max(1, perPage))
            .exec();

        if (!blogs) {
            return response.status(400).json({
                message: "Blog not found",
                error: true,
                success: false
            })
        }

        return response.status(200).json({
            error: false,
            success: true,
            data: blogs,
            totalPages: totalPages,
            page: page
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//get single Blog
export async function getBlog(request, response) {
    try {
        const blog = await BlogModel.findById(request.params.id)

        if (!blog) {
            return response.status(500).json({
                message: "The Blog with the given ID was not found",
                error: true,
                success: false
            })
        }
        return response.status(200).json({
            error: false,
            success: true,
            blog: blog
        })


    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function deleteBlog(request, response) {
    try {
        const blog = await BlogModel.findById(request.params.id)

        if (!blog) {
            return response.status(400).json({
                message: "blog not found",
                success: false,
                error: true
            })
        }

        // Delete images from Cloudinary first
        const images = blog.images || [];
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

        // Delete the main Blog
        const deletedBlog = await BlogModel.findByIdAndDelete(request.params.id)

        if (!deletedBlog) {
            return response.status(400).json({
                message: "Blog not found",
                success: false,
                error: true
            })
        }

        return response.status(200).json({
            message: "Blog Deleted!",
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

export async function updatedBlog(request, response) {
    try {

        const blog = await BlogModel.findByIdAndUpdate(
            request.params.id,
            {
                title: request.body.title,
                description: request.body.description,
                images: imagesArr.length > 0 ? imagesArr[0] : request.body.images,
            },
            { new: true }
        )

        if (!blog) {
            return response.status(400).json({
                message: "Blog cannnot be updated!",
                success: false,
                error: true
            })
        }
        imagesArr = []

        response.status(200).json({
            success: true,
            error: false,
            blog: blog,
            message: "Blog updated successfully!"
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}