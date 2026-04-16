import { error } from "console";
import ProductModel from "../models/product.model.js";
import ProductRAMSModel from "../models/productRAM.model.js";
import productWEIGHTModel from "../models/productWEIGHT.model.js";
import productSIZEModel from "../models/productSIZE.model.js";
import ReviewModel from "../models/reviews.model.js";
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
        const files = request.files;

        if (!files || files.length === 0) {
            return response.status(400).json({
                message: "No files uploaded",
                error: true,
                success: false
            });
        }

        const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: false
        };

        for (let i = 0; i < files.length; i++) {
            try {
                const file = files[i];
                const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
                const result = await cloudinary.uploader.upload(dataUri, options);
                if (result && result.secure_url) {
                    imagesArr.push(result.secure_url);
                }
            } catch (uploadError) {
                console.error(`Error uploading file ${files[i].fieldname}:`, uploadError);
            }
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


//create product
export async function createProduct(request, response) {
    try {
        let product = new ProductModel({
            name: request.body.name,
            description: request.body.description,
            images: request.body.images?.length ? request.body.images : imagesArr,
            bannerImages: request.body.bannerImages || [],
            bannerTitlename: request.body.bannerTitlename || "none",
            isDisplayOnHomeBanner: request.body.isDisplayOnHomeBanner,
            brand: request.body.brand,
            price: request.body.price,
            oldPrice: request.body.oldPrice,
            catName: request.body.catName,
            catId: request.body.catId,
            subCatId: request.body.subCatId,
            subCat: request.body.subCat,
            thirdsubCat: request.body.thirdsubCat,
            thirdsubCatId: request.body.thirdsubCatId,
            category: request.body.category,
            countInStock: request.body.countInStock,
            rating: request.body.rating,
            isFeatured: request.body.isFeatured,
            discount: request.body.discount,
            productRam: request.body.productRam,
            size: request.body.size,
            productWeight: request.body.productWeight,
            location: request.body.location
        })

        product = await product.save()

        if (!product) {
            response.status(500).json({
                message: "Product not created",
                error: false,
                success: true
            })
        }

        imagesArr = []

        response.status(200).json({
            message: "Product created successfully",
            error: false,
            success: true,
            product: product
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}


//get all products
export async function getAllProducts(request, response) {
    try {

        const page = parseInt(request.query.page) || 1;
        const perPage = parseInt(request.query.perPage);
        const totalPosts = await ProductModel.countDocuments();
        const totalPages = Math.ceil(totalPosts / perPage)

        if (page > totalPages) {
            return response.status(404).json({
                message: "Page not found",
                error: true,
                success: false
            })
        }

        const products = await ProductModel.find()
            .populate("category")
            .skip((page - 1) * perPage)
            .limit(perPage)
            .exec();;

        if (!products) {
            response.status(500).json({
                error: true,
                success: false
            })
        }

        return response.status(200).json({
            error: false,
            success: true,
            data: products,
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


//get all products by category id
export async function getAllProductsByCatId(request, response) {
    try {

        const page = parseInt(request.query.page) || 1;
        const perPage = parseInt(request.query.perPage) || 10000;
        const totalPosts = await ProductModel.countDocuments();
        const totalPages = Math.ceil(totalPosts / perPage)

        if (page > totalPages) {
            return response.status(404).json({
                message: "Page not found",
                error: true,
                success: false
            })
        }

        const products = await ProductModel.find({
            catId: request.params.id
        })
            .populate("category")
            .skip((page - 1) * perPage)
            .limit(perPage)
            .exec();;

        if (!products) {
            response.status(500).json({
                error: true,
                success: false
            })
        }

        return response.status(200).json({
            error: false,
            success: true,
            data: products,
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

//get all products by category name
export async function getAllProductsByCatName(request, response) {
    try {

        const page = parseInt(request.query.page) || 1;
        const perPage = parseInt(request.query.perPage) || 10000;
        const totalPosts = await ProductModel.countDocuments();
        const totalPages = Math.ceil(totalPosts / perPage)

        if (page > totalPages) {
            return response.status(404).json({
                message: "Page not found",
                error: true,
                success: false
            })
        }

        const products = await ProductModel.find({
            catName: request.query.catName
        })
            .populate("category")
            .skip((page - 1) * perPage)
            .limit(perPage)
            .exec();;

        if (!products) {
            response.status(500).json({
                error: true,
                success: false
            })
        }

        return response.status(200).json({
            error: false,
            success: true,
            products: products,
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

//get all products by sub category id
export async function getAllProductsBySubCatId(request, response) {
    try {

        const page = parseInt(request.query.page) || 1;
        const perPage = parseInt(request.query.perPage) || 10000;
        const totalPosts = await ProductModel.countDocuments();
        const totalPages = Math.ceil(totalPosts / perPage)

        if (page > totalPages) {
            return response.status(404).json({
                message: "Page not found",
                error: true,
                success: false
            })
        }

        const products = await ProductModel.find({
            subCatId: request.params.id
        })
            .populate("category")
            .skip((page - 1) * perPage)
            .limit(perPage)
            .exec();;

        if (!products) {
            response.status(500).json({
                error: true,
                success: false
            })
        }

        return response.status(200).json({
            error: false,
            success: true,
            data: products,
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

//get all products by sub category name
export async function getAllProductsBySubCatName(request, response) {
    try {

        const page = parseInt(request.query.page) || 1;
        const perPage = parseInt(request.query.perPage) || 10000;
        const totalPosts = await ProductModel.countDocuments();
        const totalPages = Math.ceil(totalPosts / perPage)

        if (page > totalPages) {
            return response.status(404).json({
                message: "Page not found",
                error: true,
                success: false
            })
        }

        const products = await ProductModel.find({
            subCat: request.query.subCat
        })
            .populate("category")
            .skip((page - 1) * perPage)
            .limit(perPage)
            .exec();;

        if (!products) {
            response.status(500).json({
                error: true,
                success: false
            })
        }

        return response.status(200).json({
            error: false,
            success: true,
            products: products,
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

//get all products by sub category id
export async function getAllProductsByThirdLevelCatId(request, response) {
    try {

        const page = parseInt(request.query.page) || 1;
        const perPage = parseInt(request.query.perPage) || 10000;
        const totalPosts = await ProductModel.countDocuments();
        const totalPages = Math.ceil(totalPosts / perPage)

        if (page > totalPages) {
            return response.status(404).json({
                message: "Page not found",
                error: true,
                success: false
            })
        }

        const products = await ProductModel.find({
            thirdsubCatId: request.params.id
        })
            .populate("category")
            .skip((page - 1) * perPage)
            .limit(perPage)
            .exec();;

        if (!products) {
            response.status(500).json({
                error: true,
                success: false
            })
        }

        return response.status(200).json({
            error: false,
            success: true,
            data: products,
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

//get all products by sub category name
export async function getAllProductsByThirdLevelCatName(request, response) {
    try {

        const page = parseInt(request.query.page) || 1;
        const perPage = parseInt(request.query.perPage) || 10000;
        const totalPosts = await ProductModel.countDocuments();
        const totalPages = Math.ceil(totalPosts / perPage)

        if (page > totalPages) {
            return response.status(404).json({
                message: "Page not found",
                error: true,
                success: false
            })
        }

        const products = await ProductModel.find({
            thirdsubCat: request.query.thirdsubCat
        })
            .populate("category")
            .skip((page - 1) * perPage)
            .limit(perPage)
            .exec();;

        if (!products) {
            response.status(500).json({
                error: true,
                success: false
            })
        }

        return response.status(200).json({
            error: false,
            success: true,
            products: products,
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

//get all products by price
export async function getAllProductsByPrice(request, response) {
    let productList = []

    if (request.query.catId !== "" && request.query.catId !== undefined) {
        const productListArr = await ProductModel.find({
            catId: request.query.catId
        }).populate("category")

        productList = productListArr
    }

    if (request.query.subCatId !== "" && request.query.subCatId !== undefined) {
        const productListArr = await ProductModel.find({
            subCatId: request.query.subCatId
        }).populate("category")

        productList = productListArr
    }

    if (request.query.thirdsubCatId !== "" && request.query.thirdsubCatId !== undefined) {
        const productListArr = await ProductModel.find({
            thirdsubCatId: request.query.thirdsubCatId
        }).populate("category")

        productList = productListArr
    }

    const filteredProducts = productList.filter((product) => {
        if (request.query.minPrice && product.price < parseInt(+request.query.minPrice)) {
            return False;
        }
        if (request.query.maxPrice && product.price > parseInt(+request.query.maxPrice)) {
            return false
        }
        return true;
    })

    return response.status(200).json({
        error: false,
        success: true,
        products: filteredProducts,
        totalPages: 0,
        page: 0
    })
}


//get all products by rating
export async function getAllProductsByRating(request, response) {
    try {

        const page = parseInt(request.query.page) || 1;
        const perPage = parseInt(request.query.perPage) || 10000;
        const totalPosts = await ProductModel.countDocuments();
        const totalPages = Math.ceil(totalPosts / perPage)

        if (page > totalPages) {
            return response.status(404).json({
                message: "Page not found",
                error: true,
                success: false
            })
        }

        let products = [];

        if (request.body.catId !== undefined) {
            products = await ProductModel.find({
                rating: request.query.rating,
                catId: request.query.catId
            })
                .populate("category")
                .skip((page - 1) * perPage)
                .limit(perPage)
                .exec();;
        }


        if (request.body.subCatId !== undefined) {
            products = await ProductModel.find({
                rating: request.query.rating,
                subCatId: request.query.subCatId
            })
                .populate("category")
                .skip((page - 1) * perPage)
                .limit(perPage)
                .exec();;
        }

        if (request.body.thirdsubCatId !== undefined) {
            products = await ProductModel.find({
                rating: request.query.rating,
                thirdsubCatId: request.query.thirdsubCatId
            })
                .populate("category")
                .skip((page - 1) * perPage)
                .limit(perPage)
                .exec();;
        }

        if (!products) {
            response.status(500).json({
                error: true,
                success: false
            })
        }

        return response.status(200).json({
            error: false,
            success: true,
            products: products,
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


//get all products count
export async function getProductsCount(request, response) {
    try {
        const productsCount = await ProductModel.countDocuments();

        if (!productsCount) {
            response.status(500).json({
                error: true,
                success: false
            })
        }

        return response.status(200).json({
            error: false,
            success: true,
            productCount: productsCount
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}


//get all features products
export async function getAllFeaturedProducts(request, response) {
    try {
        const products = await ProductModel.find({
            isFeatured: true
        }).populate("category")

        if (!products) {
            response.status(500).json({
                error: true,
                success: false
            })
        }

        return response.status(200).json({
            error: false,
            success: true,
            products: products,
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}


//delete product
export async function deleteProduct(request, response) {
    const product = await ProductModel.findById
        (request.params.id)
        .populate("category")


    if (!product) {
        return response.status(404).json({
            message: "Product not found",
            error: true,
            success: false
        })
    }

    const images = product.images;
    let img = ""
    for (img of images) {
        const imgUrl = img;
        const urlArr = imgUrl.split("/")
        const image = urlArr[urlArr.length - 1]
        const imageName = image.split(".")[0]

        if (imageName) {
            cloudinary.uploader.destroy(imageName, (error, result) => {

            })
        }
    }


    const deletedProduct = await ProductModel.findByIdAndDelete(request.params.id);

    if (!deletedProduct) {
        response.status(404).json({
            message: "Product not deleted!",
            success: false,
            error: true
        })
    }

    return response.status(200).json({
        success: true,
        error: false,
        message: "Product Deleted!"
    })
}

//delete multiple products 
export async function deleteMultipleProduct(request, response) {
    try {
        const { ids } = request.body;

        if (!ids || !Array.isArray(ids)) {
            return response.status(400).json({
                error: true,
                success: false,
                message: "Invalid input"
            });
        }

        // Fetch all products at once
        const products = await ProductModel.find({
            _id: { $in: ids }
        });

        // Collect all public IDs
        const publicIds = [];

        products.forEach(product => {
            if (product.images && Array.isArray(product.images)) {
                product.images.forEach(imgUrl => {
                    const urlParts = imgUrl.split("/");
                    const fileWithExtension = urlParts.pop();
                    const publicId = fileWithExtension.split(".")[0];

                    if (publicId) {
                        publicIds.push(publicId);
                    }
                });
            }
        });

        // Delete images from Cloudinary (await properly)
        await Promise.all(
            publicIds.map(id => cloudinary.uploader.destroy(id))
        );

        // Delete products from DB
        await ProductModel.deleteMany({
            _id: { $in: ids }
        });

        return response.status(200).json({
            message: "Products deleted successfully",
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

export async function getProduct(request, response) {
    try {
        const product = await ProductModel.findById(request.params.id).populate("category")

        if (!product) {
            return response.status(404).json({
                message: "The product is not found",
                error: true,
                success: false
            })
        }

        const reviews = await ReviewModel.find({ productId: request.params.id });

        return response.status(200).json({
            error: false,
            success: true,
            product: {
                ...product._doc,
                reviews: reviews
            }
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
            }
        )

        if (res) {
            response.status(200).send(res);
        }
    }
}


//update the product
export async function updateProduct(request, response) {
    try {
        const product = await ProductModel.findByIdAndUpdate(
            request.params.id,
            {
                name: request.body.name,
                description: request.body.description,
                images: request.body.images,
                bannerImages: request.body.bannerImages,
                bannerTitlename: request.body.bannerTitlename,
                isDisplayOnHomeBanner: request.body.isDisplayOnHomeBanner,
                brand: request.body.brand,
                price: request.body.price,
                oldPrice: request.body.oldPrice,
                catName: request.body.catName,
                catId: request.body.catId,
                subCatId: request.body.subCatId,
                subCat: request.body.subCat,
                thirdsubCat: request.body.thirdsubCat,
                thirdsubCatId: request.body.thirdsubCatId,
                category: request.body.category,
                countInStock: request.body.countInStock,
                rating: request.body.rating,
                isFeatured: request.body.isFeatured,
                discount: request.body.discount,
                productRam: request.body.productRam,
                size: request.body.size,
                productWeight: request.body.productWeight,
                location: request.body.location
            },
            { new: true }
        )


        if (!product) {
            return response.status(404).json({
                message: "The product is not updated",
                status: false
            })
        }

        imagesArr = [];

        return response.status(200).json({
            message: "The product is updated",
            error: false,
            success: true
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}



{/* RAMS FUNCTIONALITY */ }
//create Product RAM
export async function createProductRAMS(request, response) {
    try {
        let productRAMS = new ProductRAMSModel({
            name: request.body.name
        })
        productRAMS = await productRAMS.save()

        if (!productRAMS) {
            return response.status(404).json({
                message: "Product RAMS not created",
                error: true,
                success: false
            })
        }

        return response.status(200).json({
            message: "Product RAMS created successfully",
            error: false,
            success: true,
            productRAMS: productRAMS
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//delete product RAM
export async function deleteProductRAM(request, response) {
    const productRAMS = await ProductRAMSModel.findById
        (request.params.id)


    if (!productRAMS) {
        return response.status(404).json({
            message: "Item not found",
            error: true,
            success: false
        })
    }


    const deletedProductRAM = await ProductRAMSModel.findByIdAndDelete(request.params.id);

    if (!deletedProductRAM) {
        response.status(404).json({
            message: "Item not deleted!",
            success: false,
            error: true
        })
    }

    return response.status(200).json({
        success: true,
        error: false,
        message: "Product RAM Deleted!"
    })
}

//update the product RAM
export async function updateProductRAM(request, response) {
    try {
        const productRAM = await ProductRAMSModel.findByIdAndUpdate(
            request.params.id,
            {
                name: request.body.name,
            },
            { new: true }
        )


        if (!productRAM) {
            return response.status(404).json({
                message: "The product RAM can not be updated",
                status: false
            })
        }

        return response.status(200).json({
            message: "The product RAM is updated",
            error: false,
            success: true
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//get all products
export async function getProductRAM(request, response) {
    try {
        const productRAM = await ProductRAMSModel.find()


        if (!productRAM) {
            response.status(500).json({
                error: true,
                success: false
            })
        }

        return response.status(200).json({
            error: false,
            success: true,
            data: productRAM
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function getProductRAMId(request, response) {
    try {
        const productRAM = await ProductRAMSModel.findById(request.params.id)


        if (!productRAM) {
            response.status(500).json({
                error: true,
                success: false
            })
        }

        return response.status(200).json({
            error: false,
            success: true,
            data: productRAM
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}


{/* Weight FUNCTIONALITY */ }
//create Product WEIGHT
export async function createProductWEIGHT(request, response) {
    try {
        let productWeight = new productWEIGHTModel({
            name: request.body.name
        })
        productWeight = await productWeight.save()

        if (!productWeight) {
            return response.status(404).json({
                message: "Product Weight not created",
                error: true,
                success: false
            })
        }

        return response.status(200).json({
            message: "Product Weight created successfully",
            error: false,
            success: true,
            productWeight: productWeight
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//delete product WEIGHT
export async function deleteProductWEIGHT(request, response) {
    const productWeight = await productWEIGHTModel.findById
        (request.params.id)


    if (!productWeight) {
        return response.status(404).json({
            message: "Item not found",
            error: true,
            success: false
        })
    }


    const deletedProductWeight = await productWEIGHTModel.findByIdAndDelete(request.params.id);

    if (!deletedProductWeight) {
        response.status(404).json({
            message: "Item not deleted!",
            success: false,
            error: true
        })
    }

    return response.status(200).json({
        success: true,
        error: false,
        message: "Product Weight Deleted!"
    })
}

//update the product WEIGHT
export async function updateProductWEIGHT(request, response) {
    try {
        const productWEIGHT = await productWEIGHTModel.findByIdAndUpdate(
            request.params.id,
            {
                name: request.body.name,
            },
            { new: true }
        )


        if (!productWEIGHT) {
            return response.status(404).json({
                message: "The product WEIGHT can not be updated",
                status: false
            })
        }

        return response.status(200).json({
            message: "The product WEIGHT is updated",
            error: false,
            success: true
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//get all products
export async function getProductWEIGHT(request, response) {
    try {
        const productWEIGHT = await productWEIGHTModel.find()


        if (!productWEIGHT) {
            response.status(500).json({
                error: true,
                success: false
            })
        }

        return response.status(200).json({
            error: false,
            success: true,
            data: productWEIGHT
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function getProductWEIGHTById(request, response) {
    try {
        const productWEIGHT = await productWEIGHTModel.findById(request.params.id)


        if (!productWEIGHT) {
            response.status(500).json({
                error: true,
                success: false
            })
        }

        return response.status(200).json({
            error: false,
            success: true,
            data: productWEIGHT
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}



{/* SIZE FUNCTIONALITY */ }
//create Product SIZE
export async function createProductSIZE(request, response) {
    try {
        let productSize = new productSIZEModel({
            name: request.body.name
        })
        productSize = await productSize.save()

        if (!productSize) {
            return response.status(404).json({
                message: "Product Size not created",
                error: true,
                success: false
            })
        }

        return response.status(200).json({
            message: "Product Size created successfully",
            error: false,
            success: true,
            productSize: productSize
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//delete product SIZE
export async function deleteProductSIZE(request, response) {
    const productSize = await productSIZEModel.findById
        (request.params.id)


    if (!productSize) {
        return response.status(404).json({
            message: "Item not found",
            error: true,
            success: false
        })
    }


    const deletedProductSize = await productSIZEModel.findByIdAndDelete(request.params.id);

    if (!deletedProductSize) {
        response.status(404).json({
            message: "Item not deleted!",
            success: false,
            error: true
        })
    }

    return response.status(200).json({
        success: true,
        error: false,
        message: "Product Size Deleted!"
    })
}

//update the product SIZE
export async function updateProductSIZE(request, response) {
    try {
        const productSize = await productSIZEModel.findByIdAndUpdate(
            request.params.id,
            {
                name: request.body.name,
            },
            { new: true }
        )


        if (!productSize) {
            return response.status(404).json({
                message: "The product SIZE can not be updated",
                status: false
            })
        }

        return response.status(200).json({
            message: "The product SIZE is updated",
            error: false,
            success: true
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//get all products
export async function getProductSIZE(request, response) {
    try {
        const productSize = await productSIZEModel.find()


        if (!productSize) {
            response.status(500).json({
                error: true,
                success: false
            })
        }

        return response.status(200).json({
            error: false,
            success: true,
            data: productSize
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function getProductSIZEById(request, response) {
    try {
        const productSize = await productSIZEModel.findById(request.params.id)


        if (!productSize) {
            response.status(500).json({
                error: true,
                success: false
            })
        }

        return response.status(200).json({
            error: false,
            success: true,
            data: productSize
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}


var bannerImage = [];
export async function uploadBannerImages(request, response) {
    try {
        bannerImage = [];

        const image = request.files;

        const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: false
        };

        for (let i = 0; i < request?.files?.length; i++) {


            const img = await cloudinary.uploader.upload(
                image[i].path,
                options,
                function (error, result) {
                    bannerImage.push(result.secure_url);
                    fs.unlinkSync(`uploads/${request.files[i].filename}`)
                }
            )
        }

        return response.status(200).json({
            images: bannerImage
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}


export async function filter(request, response) {
    try {
        const {
            catId,
            subCatId,
            thirdsubCatId,
            size,
            minPrice,
            maxPrice,
            rating,
            page,
            limit,
            q
        } = request.body;

        const filters = {};

        if (q) {
            filters.$or = [
                { name: { $regex: q, $options: "i" } },
                { catName: { $regex: q, $options: "i" } },
                { subCat: { $regex: q, $options: "i" } },
                { thirdsubCat: { $regex: q, $options: "i" } },
                { brand: { $regex: q, $options: "i" } },
            ];
        }

        // Category filters (can be arrays)
        if (catId && catId.length) {
            filters.catId = { $in: Array.isArray(catId) ? catId : [catId] };
        }

        if (subCatId && subCatId.length) {
            filters.subCatId = { $in: Array.isArray(subCatId) ? subCatId : [subCatId] };
        }

        if (thirdsubCatId && thirdsubCatId.length) {
            filters.thirdsubCatId = { $in: Array.isArray(thirdsubCatId) ? thirdsubCatId : [thirdsubCatId] };
        }

        if (size && size.length) {
            filters.size = { $in: Array.isArray(size) ? size : [size] };
        }

        // Price range
        if (minPrice || maxPrice) {
            filters.price = {
                $gte: minPrice ? Number(minPrice) : 0,
                $lte: maxPrice ? Number(maxPrice) : Infinity
            };
        }

        // Rating (min rating)
        if (rating) {
            filters.rating = { $gte: Number(rating) };
        }

        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 20;
        const skip = (pageNum - 1) * limitNum;

        const totalProducts = await ProductModel.countDocuments(filters);
        const totalPages = Math.ceil(totalProducts / limitNum) || 1;

        if (pageNum > totalPages && totalProducts > 0) {
            return response.status(404).json({
                message: "Page not found",
                error: true,
                success: false
            });
        }

        const catIdArray = Array.isArray(catId) ? catId : (catId ? [catId] : []);
        const pipeline = [{ $match: filters }];

        if (catIdArray.length > 1) {
            pipeline.push({
                $addFields: {
                    sortOrder: { $indexOfArray: [catIdArray, "$catId"] }
                }
            });
            pipeline.push({ $sort: { sortOrder: 1, _id: -1 } });
            // Remove the temporary sortOrder field just to keep response clean
            pipeline.push({ $project: { sortOrder: 0 } });
        } else {
            pipeline.push({ $sort: { _id: -1 } });
        }

        pipeline.push({ $skip: skip });
        pipeline.push({ $limit: limitNum });

        // Populate category
        pipeline.push({
            $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category"
            }
        });

        pipeline.push({
            $unwind: {
                path: "$category",
                preserveNullAndEmptyArrays: true
            }
        });

        const products = await ProductModel.aggregate(pipeline);

        return response.status(200).json({
            error: false,
            success: true,
            products,
            totalPages,
            page: pageNum,
            limit: limitNum
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

const sortItems = (products, sortBy, order) => {
    return products.sort((a, b) => {
        if (sortBy === 'name') {
            return order === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
        }
        if (sortBy === 'price') {
            return order === 'asc' ? a.price - b.price : b.price - a.price
        }
        return 0; // Return 0 to keep original order if no match
    })
}

export async function sortBy(request, response) {
    const { products, sortBy, order } = request.body;

    const sortedItems = sortItems([...(products || [])], sortBy, order);

    return response.status(200).json({
        error: false,
        success: true,
        products: sortedItems,
        totalPages: 0,
        page: 0
    })
}

export async function searchProductController(request, response) {
    try {
        const { query, page, limit } = request.body;

        if (!query) {
            return response.status(400).json({
                message: "Query is required",
                error: true,
                success: false
            });
        }

        const filter = {
            $or: [
                { name: { $regex: query, $options: "i" } },
                { catName: { $regex: query, $options: "i" } },
                { subCat: { $regex: query, $options: "i" } },
                { thirdsubCat: { $regex: query, $options: "i" } },
                { brand: { $regex: query, $options: "i" } },
            ]
        };

        const total = await ProductModel.countDocuments(filter);
        const products = await ProductModel.find(filter)
            .populate("category")
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        return response.status(200).json({
            error: false,
            success: true,
            products: products,
            total: total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}
