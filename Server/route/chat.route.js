import { Router } from 'express';
import { handleChat } from '../controllers/chat.controller.js';

const chatRouter = Router();

chatRouter.post('/', handleChat);

export default chatRouter;
