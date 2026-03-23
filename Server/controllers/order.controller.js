import OrderModel from "../models/order.model.js";
import ProductModel from "../models/product.model.js";
import paypal from "@paypal/checkout-server-sdk";

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

function getPayPalClient() {
    const environment = process.env.NODE_ENV === "live"
        ? new paypal.core.LiveEnvironment(
            process.env.PAYPAL_CLIENT_ID_LIVE,
            process.env.PAYPAL_CLIENT_SECRET_LIVE
        )
        : new paypal.core.SandboxEnvironment(
            process.env.PAYPAL_CLIENT_ID_TEST,
            process.env.PAYPAL_CLIENT_SECRET_TEST  // ✅ Fixed variable name
        );
    return new paypal.core.PayPalHttpClient(environment);
}

export const createOrderPaypalController = async (request, response) => {
    try {
        const req = new paypal.orders.OrdersCreateRequest();
        req.prefer("return=representation");
        req.requestBody({
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        value: request.body.totalAmount,
                        currency_code: "USD",
                    },
                },
            ],
        });

        try {
            const client = getPayPalClient();
            const order = await client.execute(req);
            return response.status(200).json({
                error: false,
                message: "Order created successfully",
                id: order.result.id,
                success: true
            });
        }
        catch (error) {
            console.log(error);
            return response.status(500).json({
                error: true,
                message: error.message || "Error creating PayPal order",
                success: false
            });
        }
    } catch (error) {
        return response.status(500).json({
            error: true,
            message: error.message,
            success: false
        });
    }
}

export const captureOrderPaypalController = async (request, response) => {
    try {
        const { paymentId } = request.body;

        const client = getPayPalClient();
        const req = new paypal.orders.OrdersCaptureRequest(paymentId);
        req.requestBody({});

        let captureData;
        try {
            captureData = await client.execute(req);
        } catch (paypalError) {
            console.log("PayPal capture error:", paypalError);
            return response.status(500).json({
                error: true,
                message: paypalError?.message || "PayPal capture failed",
                success: false
            });
        }

        if (captureData.result.status !== "COMPLETED") {
            return response.status(400).json({
                error: true,
                message: `Payment not completed. Status: ${captureData.result.status}`,
                success: false
            });
        }

        const orderInfo = {
            userId: request.body.userId,
            products: request.body.products.map(p => ({
                ...p,
                subTotalAmt: p.subTotalAmt || p.subTotal || (p.price * p.quantity) // ✅ Fixed
            })),
            paymentId: request.body.paymentId,
            payment_status: captureData.result.status,
            delivery_address: request.body.delivery_address,
            totalAmt: request.body.totalAmt,
            date: request.body.date
        }

        const order = new OrderModel(orderInfo);
        await order.save();

        for (let i = 0; i < request.body.products.length; i++) {
            await ProductModel.findByIdAndUpdate(
                request.body.products[i].productId,
                {
                    countInStock: parseInt(
                        request.body.products[i].countInStock -
                        request.body.products[i].quantity
                    ),
                },
                { new: true }
            );
        }

        return response.status(200).json({
            error: false,
            message: "Order placed successfully",
            order: order,
            success: true
        });

    } catch (error) {
        console.log("Capture controller error:", error);
        return response.status(500).json({
            error: true,
            message: error.message || error,
            success: false
        });
    }
}
