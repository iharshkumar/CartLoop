import { Router } from "express";
import auth from "../middleware/auth.js";
import { createOrderCOntroller, getOrderDeatilsController } from "../controllers/order.controller.js";

const orderRouter = Router()

orderRouter.post("/create", auth, createOrderCOntroller)
orderRouter.get("/order-list", auth, getOrderDeatilsController)

export default orderRouter