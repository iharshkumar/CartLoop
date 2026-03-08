import { Router } from "express";
import auth from "../middleware/auth.js";
import upload from '../middleware/multer.js'
import { addBanner, deleteBanner, getBanner, getBanners, updatedBanner } from "../controllers/bannerV1.controller.js";
import { removeImageFromCloudinary } from "../controllers/category.controller.js";
import { uploadBannerImages } from "../controllers/bannerV1.controller.js";

const bannerV1Router = Router();

bannerV1Router.post('/uploadImages',auth,upload.array('images'),uploadBannerImages);
bannerV1Router.post('/add',auth,addBanner);
bannerV1Router.get('/',getBanners);
bannerV1Router.get('/:id',getBanner);
bannerV1Router.delete('/deleteImage',auth,removeImageFromCloudinary);
bannerV1Router.delete('/:id',auth,deleteBanner);
bannerV1Router.put('/:id',auth,updatedBanner);

export default bannerV1Router;