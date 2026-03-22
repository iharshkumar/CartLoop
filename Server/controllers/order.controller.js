import OrderModel from "../models/order.model.js";
import ProductModel from "../models/product.model.js";

export const createOrderCOntroller = async (request, response) => {
    try {
        let order = new OrderModel({
            userId: request.userId,
            products: request.body.products,
            paymentId: request.body.paymentId,
            payment_status: request.body.payment_status,
            delivery_address: request.body.delivery_address,
            totalAmt: request.body.totalAmt,
            date: request.body.date
        });
        if (!order) {
            return response.status(500).json({
                error: true,
                success: false
            })
        }

        for (let i = 0; i < request.body.products.length; i++) {
            await ProductModel.findByIdAndUpdate(
                request.body.products[i].productId,
                {
                    countInStock: parseInt(request.body.products[i].countInStock - request.body.products[i].quantity),
                },
                { new: true }

            );
        }

        order = await order.save();

        return response.status(200).json({
            error: false,
            message: "Order placed successfully",
            order,
            success: true
        });
    } catch (error) {
        return response.status(500).json({
            error: true,
            message: error.message,
            success: false
        });
    }
}

export async function getOrderDeatilsController(request, response) {
    try {
        const userId = request.userId
        const orderlist = await OrderModel.find({ userId: userId }).sort({ createdAt: -1 }).populate('delivery_address userId');

        return response.status(200).json({
            error: false,
            message: "Order details",
            data: orderlist,
            success: true
        });
    } catch (error) {
        return response.status(500).json({
            error: true,
            message: error.message || error,
            success: false
        });
    }
}
