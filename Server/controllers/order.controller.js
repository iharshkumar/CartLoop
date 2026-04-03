import OrderModel from "../models/order.model.js";
import ProductModel from "../models/product.model.js";
import UserModel from "../models/user.model.js";
import paypal from "@paypal/checkout-server-sdk";
import mongoose from "mongoose";

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
        const { page, limit, all } = request.query;

        // 1. Fetch user to verify role
        const user = await UserModel.findById(userId);

        // 2. Determine filter: Default to self
        let queryFilter = { userId: userId };

        // 3. Segregation: Only allow "all" if user is ADMIN AND explicitly asks for it
        if (user && user.role === "ADMIN" && all === "true") {
            queryFilter = {};
        }

        // 4. Execute query with filter
        const orderlist = await OrderModel.find(queryFilter)
            .sort({ createdAt: -1 })
            .populate('delivery_address userId');

        const total = await OrderModel.countDocuments(queryFilter);

        return response.status(200).json({
            error: false,
            message: "Order details",
            data: orderlist,
            success: true,
            total: total,
            page: parseInt(page) || 1,
            totalPages: Math.ceil(total / (parseInt(limit) || 10))
        });
    } catch (error) {
        return response.status(500).json({
            error: true,
            message: error.message || error,
            success: false
        });
    }
}


export async function getTotalOrdersCountController(request, response) {
    try {
        const ordersCount = await OrderModel.countDocuments();
        return response.status(200).json({
            error: false,
            message: "Total orders count",
            count: ordersCount,
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
            process.env.PAYPAL_CLIENT_SECRET_TEST
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
            userId: request.userId,
            products: request.body.products.map(p => ({
                ...p,
                subTotalAmt: p.subTotalAmt || p.subTotal || (p.price * p.quantity)
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

export const updateOrderStatusController = async (request, response) => {
    try {
        const { id, order_status } = request.body;

        const updateOrder = await OrderModel.updateOne(
            {
                _id: id,
            },
            {
                order_status: order_status
            },
            { new: true }
        );
        return response.status(200).json({
            error: false,
            message: "Order status updated successfully",
            data: updateOrder,
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

export const totalSalesController = async (request, response) => {
    try {
        const currentYear = new Date().getFullYear();

        const orderList = await OrderModel.find();

        let totalSales = 0;

        let monthlySales = [
            {
                name: "JAN",
                TotalSales: 0
            },
            {
                name: "FEB",
                TotalSales: 0
            },
            {
                name: "MAR",
                TotalSales: 0
            },
            {
                name: "APR",
                TotalSales: 0
            },
            {
                name: "MAY",
                TotalSales: 0
            },
            {
                name: "JUN",
                TotalSales: 0
            },
            {
                name: "JUL",
                TotalSales: 0
            },
            {
                name: "AUG",
                TotalSales: 0
            },
            {
                name: "SEP",
                TotalSales: 0
            },
            {
                name: "OCT",
                TotalSales: 0
            },
            {
                name: "NOV",
                TotalSales: 0
            },
            {
                name: "DEC",
                TotalSales: 0
            }
        ]

        for (let i = 0; i < orderList.length; i++) {
            totalSales = totalSales + parseInt(orderList[i].totalAmt);
            const date = new Date(orderList[i]?.createdAt);
            const year = date.getFullYear();
            const month = date.getMonth() + 1; // getMonth() is 0-indexed

            if (currentYear === year) {
                if (month == 1) {
                    monthlySales[0] = {
                        name: "JAN",
                        TotalSales: monthlySales[0].TotalSales = parseInt(monthlySales[0].TotalSales) + parseInt(orderList[i].totalAmt)
                    }
                }
                else if (month == 2) {
                    monthlySales[1] = {
                        name: "FEB",
                        TotalSales: monthlySales[1].TotalSales = parseInt(monthlySales[1].TotalSales) + parseInt(orderList[i].totalAmt)
                    };
                }
                else if (month == 3) {
                    monthlySales[2] = {
                        name: "MAR",
                        TotalSales: monthlySales[2].TotalSales = parseInt(monthlySales[2].TotalSales) + parseInt(orderList[i].totalAmt)
                    };
                }
                else if (month == 4) {
                    monthlySales[3] = {
                        name: "APR",
                        TotalSales: monthlySales[3].TotalSales = parseInt(monthlySales[3].TotalSales) + parseInt(orderList[i].totalAmt)
                    };
                }
                else if (month == 5) {
                    monthlySales[4] = {
                        name: "MAY",
                        TotalSales: monthlySales[4].TotalSales = parseInt(monthlySales[4].TotalSales) + parseInt(orderList[i].totalAmt)
                    };
                }
                else if (month == 6) {
                    monthlySales[5] = {
                        name: "JUN",
                        TotalSales: monthlySales[5].TotalSales = parseInt(monthlySales[5].TotalSales) + parseInt(orderList[i].totalAmt)
                    };
                }
                else if (month == 7) {
                    monthlySales[6] = {
                        name: "JUL",
                        TotalSales: monthlySales[6].TotalSales = parseInt(monthlySales[6].TotalSales) + parseInt(orderList[i].totalAmt)
                    };
                }
                else if (month == 8) {
                    monthlySales[7] = {
                        name: "AUG",
                        TotalSales: monthlySales[7].TotalSales = parseInt(monthlySales[7].TotalSales) + parseInt(orderList[i].totalAmt)
                    };
                }
                else if (month == 9) {
                    monthlySales[8] = {
                        name: "SEP",
                        TotalSales: monthlySales[8].TotalSales = parseInt(monthlySales[8].TotalSales) + parseInt(orderList[i].totalAmt)
                    };
                }
                else if (month == 10) {
                    monthlySales[9] = {
                        name: "OCT",
                        TotalSales: monthlySales[9].TotalSales = parseInt(monthlySales[9].TotalSales) + parseInt(orderList[i].totalAmt)
                    };
                }
                else if (month == 11) {
                    monthlySales[10] = {
                        name: "NOV",
                        TotalSales: monthlySales[10].TotalSales = parseInt(monthlySales[10].TotalSales) + parseInt(orderList[i].totalAmt)
                    };
                }
                else if (month == 12) {
                    monthlySales[11] = {
                        name: "DEC",
                        TotalSales: monthlySales[11].TotalSales = parseInt(monthlySales[11].TotalSales) + parseInt(orderList[i].totalAmt)
                    };
                }
            }
        }

        return response.status(200).json({
            error: false,
            message: "Total sales",
            totalSales: totalSales,
            monthlySales: monthlySales,
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

export const totalUsersController = async (request, response) => {
    try {
        const userList = await UserModel.aggregate([
            {
                $group: {
                    _id:
                    {
                        year:
                        {
                            $year: "$createdAt"
                        },
                        month:
                        {
                            $month: "$createdAt"
                        }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1
                }
            }
        ]);

        let monthlyUsers = [
            {
                name: "JAN",
                TotalUsers: 0
            },
            {
                name: "FEB",
                TotalUsers: 0
            },
            {
                name: "MAR",
                TotalUsers: 0
            },
            {
                name: "APR",
                TotalUsers: 0
            },
            {
                name: "MAY",
                TotalUsers: 0
            },
            {
                name: "JUN",
                TotalUsers: 0
            },
            {
                name: "JUL",
                TotalUsers: 0
            },
            {
                name: "AUG",
                TotalUsers: 0
            },
            {
                name: "SEP",
                TotalUsers: 0
            },
            {
                name: "OCT",
                TotalUsers: 0
            },
            {
                name: "NOV",
                TotalUsers: 0
            },
            {
                name: "DEC",
                TotalUsers: 0
            }
        ];

        for (let i = 0; i < userList.length; i++) {
            const item = userList[i];
            if (item?._id?.month === 1) {
                monthlyUsers[0] = {
                    name: "JAN",
                    TotalUsers: item.count
                }
            }
            else if (item?._id?.month === 2) {
                monthlyUsers[1] = {
                    name: "FEB",
                    TotalUsers: item.count
                }
            }
            else if (item?._id?.month === 3) {
                monthlyUsers[2] = {
                    name: "MAR",
                    TotalUsers: item.count
                }
            }
            else if (item?._id?.month === 4) {
                monthlyUsers[3] = {
                    name: "APR",
                    TotalUsers: item.count
                }
            }
            else if (item?._id?.month === 5) {
                monthlyUsers[4] = {
                    name: "MAY",
                    TotalUsers: item.count
                }
            }
            else if (item?._id?.month === 6) {
                monthlyUsers[5] = {
                    name: "JUN",
                    TotalUsers: item.count
                }
            }
            else if (item?._id?.month === 7) {
                monthlyUsers[6] = {
                    name: "JUL",
                    TotalUsers: item.count
                }
            }
            else if (item?._id?.month === 8) {
                monthlyUsers[7] = {
                    name: "AUG",
                    TotalUsers: item.count
                }
            }
            else if (item?._id?.month === 9) {
                monthlyUsers[8] = {
                    name: "SEP",
                    TotalUsers: item.count
                }
            }
            else if (item?._id?.month === 10) {
                monthlyUsers[9] = {
                    name: "OCT",
                    TotalUsers: item.count
                }
            }
            else if (item?._id?.month === 11) {
                monthlyUsers[10] = {
                    name: "NOV",
                    TotalUsers: item.count
                }
            }
            else if (item?._id?.month === 12) {
                monthlyUsers[11] = {
                    name: "DEC",
                    TotalUsers: item.count
                }
            }
        }


        return response.status(200).json({
            error: false,
            message: "Total users",
            TotalUsers: monthlyUsers,
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