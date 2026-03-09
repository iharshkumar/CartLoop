import { Router } from "express";
import auth from "../middleware/auth.js";
import upload from '../middleware/multer.js'
import { addBannerV2, deleteBannerV2, getBannerV2, getBannersV2, updatedBannerV2, uploadBannerV2Images } from "../controllers/bannerV2.controller.js";
import { removeImageFromCloudinary } from "../controllers/category.controller.js";

const bannerV2Router = Router();

bannerV2Router.post('/uploadImages', auth, upload.array('images'), uploadBannerV2Images);
bannerV2Router.post('/add', auth, addBannerV2);
bannerV2Router.get('/', getBannersV2);
bannerV2Router.get('/:id', getBannerV2);
bannerV2Router.delete('/deleteImage', auth, removeImageFromCloudinary);
bannerV2Router.delete('/:id', auth, deleteBannerV2);
bannerV2Router.put('/:id', auth, updatedBannerV2);

export default bannerV2Router;
