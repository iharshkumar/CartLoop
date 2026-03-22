import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config()
import cookieParser from "cookie-parser";
import morgan from "morgan"
import helmet, { crossOriginResourcePolicy } from "helmet"
import connectDB from "./config/connectDB.js";
import userRouter from "./route/user.route.js";
import categoryRouter from "./route/category.route.js";
import productRouter from "./route/product.route.js";
import cartRouter from "./route/cart.route.js";
import myListRouter from "./route/myList.route.js";
import addressRouter from "./route/address.route.js";
import homeSlidesRouter from "./route/homeSlides.route.js";
import bannerV1Router from "./route/bannerV1.route.js";
import bannerV2Router from "./route/bannerV2.route.js";
import adsBannerV1Router from "./route/adsBannerV1.route.js";
import adsBannerV2Router from "./route/adsBannerV2.route.js";
import blogRouter from "./route/blog.route.js";
import orderRouter from "./route/order.route.js";

const app = express();

// Configure CORS with options
app.use(cors({
    origin: true,
    credentials: true,
}));

app.use(express.json())
app.use(cookieParser());
app.use(morgan());
app.use(helmet({
    crossOriginResourcePolicy: false
}))

app.get("/", (request, response) => {
    response.json({
        message: "Server is running " + process.env.PORT
    })
})


app.use('/api/user', userRouter)
app.use('/api/category', categoryRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/myList', myListRouter)
app.use('/api/address', addressRouter)
app.use('/api/homeSlides', homeSlidesRouter);
app.use('/api/bannerV1', bannerV1Router);
app.use('/api/bannerV2', bannerV2Router);
app.use('/api/adsBannerV1', adsBannerV1Router);
app.use('/api/adsBannerV2', adsBannerV2Router);
app.use('/api/blog', blogRouter);
app.use('/api/order', orderRouter);


connectDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log("SERVER is running", process.env.PORT)
    })
})