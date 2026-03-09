import { Router } from "express";
import auth from "../middleware/auth.js";
import upload from '../middleware/multer.js'
import { addBlog, deleteBlog, getBlog, getBlogs, updatedBlog, uploadImages } from "../controllers/blog.controller.js";

const blogRouter = Router();

blogRouter.post('/uploadImages',auth,upload.array('images'),uploadImages);
blogRouter.post('/add',auth,addBlog);
blogRouter.get('/',auth,getBlogs);
blogRouter.get('/:id',auth,getBlog);
blogRouter.delete('/:id',auth,deleteBlog);
blogRouter.put('/:id',auth,updatedBlog);

export default blogRouter;