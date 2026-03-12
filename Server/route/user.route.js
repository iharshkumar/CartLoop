import { Router } from 'express'
import {
    forgotPasswordController, loginUserContoller, logoutContoller,
    refreshToken,
    registerUserController, removeImageFromCloudinary, resetpassword, authWithGoogle,
    updateUserDetails, userAvatarController, userDetails, verifyEmailController,
    verifyForgotPasswordOtp
} from "../controllers/user.controller.js"
import auth from '../middleware/auth.js'
import upload from '../middleware/multer.js'

const userRouter = Router()

userRouter.post('/register', registerUserController)
userRouter.post('/verifyEmail', verifyEmailController)
userRouter.post('/login', loginUserContoller)
userRouter.post('/authWithGoogle', authWithGoogle)
userRouter.get('/logout', auth, logoutContoller)
userRouter.put('/user-avatar', auth, upload.array('avatar'), userAvatarController)
userRouter.delete('/deleteImage', auth, removeImageFromCloudinary);
userRouter.put('/:id', auth, updateUserDetails)
userRouter.post('/forgot-password', forgotPasswordController)
userRouter.post('/verify-forgot-password-otp', verifyForgotPasswordOtp)
userRouter.post('/reset-password', resetpassword)
userRouter.post('/refresh-token', refreshToken)
userRouter.get('/user-details', auth, userDetails)


export default userRouter;