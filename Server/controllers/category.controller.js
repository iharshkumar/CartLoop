import CategoryModel from "../models/category.model.js";

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

//create category
export async function createCategory(request, response) {
    try {
        let category = new CategoryModel({
            name: request.body.name,
            images: imagesArr,
            parentCatName: request.body.parentCatName,
            parentId: request.body.parentId
        })

        if (!category) {
            return response.status(500).json({
                message: "Category not created",
                error: true,
                success: false
            })
        }

        category = await category.save()

        imagesArr = []

        return response.status(200).json({
            message: "Category created",
            error: false,
            success: true,
            category: category
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}


//get category
export async function getCategories(request, response) {
    try {
        const categories = await CategoryModel.find()
        const categoryMap = {}

        categories.forEach(cat => {
            categoryMap[cat._id] = { ...cat._doc, children: [] }
        })
        const rootCategories = []
        categories.forEach(cat => {
            if (cat.parentId) {
                categoryMap[cat.parentId].children.push(categoryMap[cat._id])
            } else {
                rootCategories.push(categoryMap[cat._id])
            }
        })

        return response.status(200).json({
            error: false,
            success: true,
            data: rootCategories
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}


//get category count 
export async function getCategoriesCount(request, response) {
    try {
        const categoryCount = await CategoryModel.countDocuments({ parentId: undefined })
        if (!categoryCount) {
            response.status(500).json({
                success: false,
                error: true
            })
        } else {
            response.send({
                categoryCount: categoryCount,
            })
        }
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//get sub category count 
export async function getSubCategoriesCount(request, response) {
    try {
        const categories = await CategoryModel.find()
        if (!categories) {
            response.status(500).json({
                success: false,
                error: true
            })
        }
        else {
            const subCatList = [];
            for (let cat of categories) {
                if (cat.parentId !== undefined) {
                    subCatList.push(cat)
                }
            }
            response.send({
                SubCategoryCount: subCatList.length
            })
        }
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//get single category
export async function getCategory(request, response) {
    try {
        const category = await CategoryModel.findById(request.params.id)

        if (!category) {
            response.status(500).json({
                message: "The category with the given ID was not found",
                error: true,
                success: false
            })
        }
        return response.status(200).json({
            error: false,
            success: true,
            category: category
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

export async function deleteCategory(request, response) {
    try {
        const category = await CategoryModel.findById(request.params.id)

        if (!category) {
            return response.status(400).json({
                message: "Category not found",
                success: false,
                error: true
            })
        }

        // Delete images from Cloudinary first
        const images = category.images || [];
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

        // Find and delete subcategories (third level)
        const subCategory = await CategoryModel.find({
            parentId: request.params.id
        })

        for (let i = 0; i < subCategory.length; i++) {
            const thirdsubCategory = await CategoryModel.find({
                parentId: subCategory[i]._id
            })

            for (let j = 0; j < thirdsubCategory.length; j++) {
                const deletedThirdSubCat = await CategoryModel.findByIdAndDelete(thirdsubCategory[j]._id)
            }

            const deletedThirdSubCat = await CategoryModel.findByIdAndDelete(subCategory[i]._id)
        }

        // Delete the main category
        const deletedCat = await CategoryModel.findByIdAndDelete(request.params.id)

        if (!deletedCat) {
            return response.status(400).json({
                message: "Category not found",
                success: false,
                error: true
            })
        }

        return response.status(200).json({
            message: "Category Deleted!",
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


export async function updatedCategory(request, response) {
    try {
        //console.log(imagesArr)
        const category = await CategoryModel.findByIdAndUpdate(
            request.params.id,
            {
                name: request.body.name,
                images: imagesArr.length > 0 ? imagesArr[0] : request.body.images,
                parentId: request.body.parentId,
                parentCatName: request.body.parentCatName
            },
            { new: true }
        )

        if (!category) {
            return response.status(500).json({
                message: "Category cannnot be updated!",
                success: false,
                error: true
            })
        }
        imagesArr = []

        response.status(200).json({
            success: true,
            error: false,
            category: category
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}