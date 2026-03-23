import { Router } from "express";
import auth from "../middleware/auth.js";
import { captureOrderPaypalController, createOrderCOntroller, createOrderPaypalController, getOrderDeatilsController } from "../controllers/order.controller.js";

const orderRouter = Router()

orderRouter.post("/create", auth, createOrderCOntroller)
orderRouter.get("/order-list", auth, getOrderDeatilsController);
orderRouter.post("/create-order-paypal", auth, createOrderPaypalController);
orderRouter.post("/capture-order-paypal", auth, captureOrderPaypalController);

export default orderRouter