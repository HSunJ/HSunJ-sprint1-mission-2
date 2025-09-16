// import * as dotenv from 'dotenv';
import express from 'express';
import auth from '../middlewares/auth';
import { asyncHandler } from '../middlewares/asyncHandler';
import { markAsRead } from '../controllers/notificationController';

const notificationRouter = express.Router();

notificationRouter.route('/:id/read')
    .patch(auth.verifyAccessToken,
        asyncHandler(markAsRead)
    );


export default notificationRouter;