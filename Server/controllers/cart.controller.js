import CartProductModel from "../models/cartProduct.model.js";
import ProductModel from "../models/product.model.js";


export const addToCartItemController = async (request, response) => {
    try {
        const userId = request.userId //middleware
        const { productTitle, image, rating, price, oldPrice, brand, discount, size, weight, ram, quantity, subTotal, countInStock, productId } = request.body

        if (!productId) {
            return response.status(402).json({
                message: "Provide productId",
                error: true,
                success: false
            })
        }

        const checkItemCart = await CartProductModel.findOne({
            userId: userId,
            productId: productId,
            size: size,
            weight: weight,
            ram: ram
        })

        if (checkItemCart) {
            const newQty = checkItemCart.quantity + (quantity || 1);
            const newSubTotal = checkItemCart.price * newQty;

            const updateCartItem = await CartProductModel.findOneAndUpdate(
                { _id: checkItemCart._id },
                { quantity: newQty, subTotal: newSubTotal },
                { new: true }
            )

            return response.status(200).json({
                data: updateCartItem,
                message: "Item quantity updated in cart",
                error: false,
                success: true
            })
        }

        const cartItem = new CartProductModel({
            productTitle: productTitle,
            image: image,
            rating: rating,
            price: price,
            oldPrice: oldPrice,
            discount: discount,
            brand: brand,
            size: size,
            weight: weight,
            ram: ram,
            quantity: quantity,
            subTotal: subTotal,
            countInStock: countInStock,
            productId: productId,
            userId: userId
        })

        const save = await cartItem.save()

        return response.status(200).json({
            data: save,
            message: "Item add successfully",
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

export const getCartItemController = async (request, response) => {
    try {
        const userId = request.userId

        const cartItems = await CartProductModel.find({
            userId: userId
        })

        // Fetch available variations for each product
        const cartItemsWithVariations = await Promise.all(cartItems.map(async (item) => {
            const product = await ProductModel.findById(item.productId);
            return {
                ...item._doc,
                productRams: product?.productRam || [],
                productSizes: product?.size || [],
                productWeights: product?.productWeight || []
            }
        }));

        return response.json({
            data: cartItemsWithVariations,
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

export const updateCartItemController = async (request, response) => {
    try {
        const userId = request.userId
        const { _id, quantity, size, weight, ram, subTotal } = request.body

        if (!_id) {
            return response.status(400).json({
                message: "Provide _id"
            })
        }

        const updateData = {};
        if (quantity !== undefined) updateData.quantity = quantity;
        if (size !== undefined) updateData.size = size;
        if (weight !== undefined) updateData.weight = weight;
        if (ram !== undefined) updateData.ram = ram;
        if (subTotal !== undefined) updateData.subTotal = subTotal;

        const updateCartItem = await CartProductModel.findOneAndUpdate(
            {
                _id: _id,
                userId: userId
            },
            updateData,
            { new: true }
        )

        return response.json({
            message: "Cart updated successfully",
            success: true,
            error: false,
            data: updateCartItem
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const deleteCartItemQtyController = async (request, response) => {
    try {
        const userId = request.userId
        const { id } = request.params
        if (!id) {
            return response.status(400).json({
                message: "Provide _id",
                error: true,
                success: false
            })
        }

        const deleteCartItem = await CartProductModel.deleteOne(
            {
                _id: id,
                userId: userId
            }
        )

        if (!deleteCartItem) {
            return response.status(404).json({
                message: "The product in the cart is not found",
                error: true,
                success: false
            })
        }

        return response.json({
            message: "Item remove",
            error: false,
            success: true,
            data: deleteCartItem
        })


    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export const emptyCartController = async (request, response) => {
    try {
        const userId = request.userId

        await CartProductModel.deleteMany({
            userId: userId
        })

        return response.status(200).json({
            message: "Cart emptied successfully",
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