import UserModel from '../models/user.model.js'
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sendEmailFun from "../config/sendEmail.js"
import VerificationEmail from '../utils/verifyEmailTemplate.js';
import generatedAccessToken from '../utils/generateAccessToken.js';
import generatedRefreshToken from '../utils/generateRefreshToken.js';

import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
import ReviewModel from '../models/reviews.model.js';

cloudinary.config({
    cloud_name: process.env.cloudinary_Config_Cloud_name,
    api_key: process.env.cloudinary_Config_api_key,
    api_secret: process.env.cloudinary_api_secret,
    secure: true,
})

export async function registerUserController(request, response) {
    try {
        let user;

        const { name, email, password } = request.body

        if (!name || !email || !password) {
            return response.status(400).json({
                message: "Provide email,name,password",
                error: true,
                success: false
            })
        }
        user = await UserModel.findOne({ email: email })
        if (user) {
            return response.json({
                message: "User already registered with this email",
                error: true,
                success: false
            })
        }

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(password, salt)


        user = new UserModel({
            email: email,
            password: hashPassword,
            name: name,
            otp: verifyCode,
            otpExpires: Date.now() + 600000

        });

        await user.save();

        //Send Verification email
        await sendEmailFun({
            sendTo: email,
            subject: "Verify email from Ecommerce",
            text: "",
            html: VerificationEmail(name, verifyCode)
        })

        //Create a JWT token for verification purposes
        const token = jwt.sign(
            {
                email: user.email,
                id: user._id
            },
            process.env.JSON_WEB_TOKEN_SECRET_KEY
        )

        return response.status(200).json({
            success: true,
            error: false,
            message: "User registered successfully! Please verify your email.",
            token: token
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function verifyEmailController(request, response) {
    try {
        const { email, otp } = request.body

        const user = await UserModel.findOne({ email: email })

        if (!user) {
            return response.status(400).json({
                message: "User not found",
                error: true,
                success: false

            })
        }

        const isCodeValid = user.otp === otp;
        const isNotExpired = user.otpExpires > Date.now();

        if (isCodeValid && isNotExpired) {
            user.verify_email = true;
            user.otp = null;
            user.otpExpires = null;
            await user.save();
            return response.status(200).json({
                success: true,
                error: false,
                message: "Email verified successfully"
            })

        } else if (!isCodeValid) {
            return response.status(400).json({
                success: false,
                errro: true,
                message: "Invalid OTP"
            })
        } else {
            return response.status(400).json({
                success: false,
                error: true,
                message: "OTP expired"
            })
        }

    }
    catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function authWithGoogle(request, response) {
    const { name, email, password, avatar, mobile, role } = request.body;
    try {
        const existingUser = await UserModel.findOne({ email: email });
        if (!existingUser) {
            const user = await UserModel.create({
                name: name,
                email: email,
                password: "null",
                avatar: avatar,
                mobile: mobile,
                role: role,
                verify_email: true,
                signUpWithGoogle: true
            })

            await user.save();
            const accesstoken = await generatedAccessToken(user._id);
            const refreshToken = await generatedRefreshToken(user._id);

            await UserModel.findByIdAndUpdate(user?._id, {
                last_login_date: new Date()
            })

            const cookiesOption = {
                httpOnly: true,
                secure: true,
                sameSite: "None"
            }
            response.cookie('accessToken', accesstoken, cookiesOption)
            response.cookie('refreshToken', refreshToken, cookiesOption)

            return response.json({
                message: "Login Successfully",
                error: false,
                succes: true,
                data: {
                    accesstoken,
                    refreshToken
                }
            })
        }
        else {
            const accesstoken = await generatedAccessToken(existingUser._id);
            const refreshToken = await generatedRefreshToken(existingUser._id);

            await UserModel.findByIdAndUpdate(existingUser?._id, {
                last_login_date: new Date()
            })

            const cookiesOption = {
                httpOnly: true,
                secure: true,
                sameSite: "None"
            }
            response.cookie('accessToken', accesstoken, cookiesOption)
            response.cookie('refreshToken', refreshToken, cookiesOption)

            return response.json({
                message: "Login Successfully",
                error: false,
                succes: true,
                data: {
                    accesstoken,
                    refreshToken
                }
            })
        }


    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }

}

export async function loginUserContoller(request, response) {
    try {
        const { email, password } = request.body;

        const user = await UserModel.findOne({ email: email });

        if (!user) {
            return response.status(400).json({
                message: "User not registered",
                error: true,
                success: false
            })
        }

        if (user.status !== "Active") {
            return response.status(400).json({
                message: "Contact to admin",
                error: true,
                success: false
            })
        }

        if (user.verify_email !== true) {
            return response.status(400).json({
                message: "Your email is not verify yet .Please verify your email first",
                error: true,
                success: false
            })
        }

        const checkPassword = await bcryptjs.compare(password, user.password);

        if (!checkPassword) {
            return response.status(400).json({
                message: "Check your password",
                error: true,
                success: false
            })
        }

        const accesstoken = await generatedAccessToken(user._id);
        const refreshToken = await generatedRefreshToken(user._id);

        const updateUser = await UserModel.findByIdAndUpdate(user?._id, {
            last_login_date: new Date()
        })

        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }
        response.cookie('accessToken', accesstoken, cookiesOption)
        response.cookie('refreshToken', refreshToken, cookiesOption)

        return response.json({
            message: "Login Successfully",
            error: false,
            succes: true,
            data: {
                accesstoken,
                refreshToken
            }
        })

    }
    catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })

    }
}



//LOGOUT CONTROLLER
export async function logoutContoller(request, response) {
    try {
        const userid = request.userId //middleware
        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }

        response.clearCookie('accessToken', cookiesOption)
        response.clearCookie('refreshToken', cookiesOption)

        const removeRefreshToken = await UserModel.findByIdAndUpdate(userid,
            {
                refresh_token: ""
            }
        )

        return response.json({
            message: "Logout Successfully",
            error: false,
            success: true,
        })
    }
    catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })

    }
}


//image upload
var imagesArr = []
export async function userAvatarController(request, response) {
    try {
        imagesArr = [];
        const userId = request.userId;
        const image = request.files;


        const user = await UserModel.findOne({ _id: userId })

        if (!user) {
            return response.status(500).json({
                message: "User not found",
                error: true,
                success: true
            })
        }


        //first remove image from cloudinary
        const imgUrl = user.avatar;
        const urlArr = imgUrl.split("/");
        const avatar_image = urlArr[urlArr.length - 1];

        const imageName = avatar_image.split(".")[0];

        if (imageName) {
            const res = await cloudinary.uploader.destroy(
                imageName,
                (error, result) => {
                    // console.log(error,res)
                }
            )

        }



        const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: false
        };

        for (let i = 0; i < request?.files?.length; i++) {
            const file = request.files[i];
            const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
            await cloudinary.uploader.upload(
                dataUri,
                options,
                function (error, result) {
                    if (result) {
                        imagesArr.push(result.secure_url);
                    }
                }
            )
        }

        user.avatar = imagesArr[0];
        await user.save();

        return response.status(200).json({
            _id: userId,
            avtar: imagesArr[0]
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//image removes
export async function removeImageFromCloudinary(request, response) {
    const imgUrl = request.query.img;
    const urlArr = imgUrl.split("/");
    const image = urlArr[urlArr.length - 1];

    const imageName = image.split(".")[0];

    if (imageName) {
        const res = await cloudinary.uploader.destroy(
            imageName,
            (error, result) => {
                // console.log(error,res)
            }
        )

        if (res) {
            response.status(200).send(res);
        }
    }
}


//update user details
export async function updateUserDetails(request, response) {
    try {
        const userId = request.userId //auth middleware
        const { name, email, mobile, password } = request.body

        const userExist = await UserModel.findById(userId);

        if (!userExist) {
            return response.status(400).send('The user cannot be Updated!')
        }

        let verifyCode = "";
        let emailChanged = false;

        // Only check email change if email is provided in request
        if (email !== undefined && email !== null) {
            // Normalize emails for comparison (trim and lowercase)
            const normalizedNewEmail = email?.trim().toLowerCase()
            const normalizedOldEmail = userExist.email?.trim().toLowerCase()
            emailChanged = normalizedNewEmail !== normalizedOldEmail

            if (emailChanged) {
                verifyCode = Math.floor(10000 + Math.random() * 900000).toString();
            }
        }

        let hashPassword = ""

        if (password) {
            const salt = await bcryptjs.genSalt(10);
            hashPassword = await bcryptjs.hash(password, salt)
        } else {
            hashPassword = userExist.password;
        }


        // Build update data - only include fields that are provided
        const updateData = {
            name: name,
            mobile: mobile,
            password: hashPassword
        }

        // Only include email in update if it's provided
        if (email !== undefined && email !== null) {
            updateData.email = email;
            updateData.otp = verifyCode !== "" ? verifyCode : null;
            updateData.otpExpires = verifyCode !== "" ? Date.now() + 600000 : null;
        }

        // Only reset verify_email if email is provided AND actually changed, otherwise preserve existing value
        if (emailChanged) {
            updateData.verify_email = false
        } else {
            // Explicitly preserve verify_email when email hasn't changed or wasn't provided
            updateData.verify_email = userExist.verify_email
        }

        const updateUser = await UserModel.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        )

        //send Verification email
        if (emailChanged) {
            await sendEmailFun({
                sendTo: email,
                subject: "Verify email from Ecommerce App",
                text: "",
                html: VerificationEmail(name, verifyCode)
            })
        }

        return response.json({
            message: "User Updated successfully",
            error: false,
            success: true,
            user: {
                name: updateUser?.name,
                _id: updateUser?._id,
                email: updateUser?.email,
                mobile: updateUser?.mobile,
                avatar: updateUser?.avatar,
            }
        })
    }
    catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//forgot password
export async function forgotPasswordController(request, response) {
    try {
        const { email } = request.body

        const user = await UserModel.findOne({ email: email })

        if (!user) {
            return response.status(400).json({
                message: "Email not available",
                error: true,
                success: false
            })
        }
        else {
            let verifyCode = Math.floor(10000 + Math.random() * 900000).toString();

            user.otp = verifyCode
            user.otpExpires = Date.now() + 600000;

            await user.save()


            await sendEmailFun({
                sendTo: email,
                subject: "Verify OTP from Ecommerce App",
                text: "",
                html: VerificationEmail(user.name, verifyCode)
            })

            return response.json({
                message: "Check your email",
                error: false,
                success: true
            })

        }

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//
export async function verifyForgotPasswordOtp(request, response) {
    try {

        const { email, otp } = request.body


        const user = await UserModel.findOne({ email: email })

        if (!user) {
            return response.status(400).json({
                message: "Email not available",
                error: true,
                success: false
            })
        }

        if (!email || !otp) {
            return response.status(400).json({
                message: "Provide required field email,otp",
                error: true,
                success: false
            })
        }

        if (otp !== user.otp) {
            return response.status(400).json({
                message: "OTP invalid",
                error: true,
                success: false
            })
        }

        //otp expires
        const currentTime = new Date().toISOString()

        if (user.otpExpires < currentTime) {
            return response.status(400).json({
                message: "OTP is expired",
                error: true,
                success: false
            })
        }


        user.otp = ""
        user.otpExpires = ""

        await user.save()

        // Issue a short-lived reset token to be used by /reset-password
        // This avoids requiring oldPassword during the forgot-password flow.
        const resetToken = jwt.sign(
            {
                _id: user?._id,
                email: user?.email,
                purpose: "FORGOT_PASSWORD_RESET"
            },
            process.env.JSON_WEB_TOKEN_SECRET_KEY,
            { expiresIn: "10m" }
        )

        return response.status(200).json({
            message: "OTP verified",
            error: false,
            success: true,
            resetToken
        })
    }
    catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}


//reset password
export async function resetpassword(request, response) {
    try {
        const { email, oldPassword, newPassword, confirmPassword, resetToken } = request.body
        if (!email || !newPassword || !confirmPassword) {
            return response.status(400).json({
                error: true,
                success: false,
                message: "Provide required fields email, newPassword, confirmPassword"
            })
        }

        const user = await UserModel.findOne({ email })
        if (!user) {
            return response.status(400).json({
                message: "Email is not available",
                error: true,
                success: false
            })
        }

        if (resetToken) {
            try {
                const decoded = jwt.verify(resetToken, process.env.JSON_WEB_TOKEN_SECRET_KEY)
                if (decoded?.purpose !== "FORGOT_PASSWORD_RESET" || decoded?.email !== email) {
                    return response.status(401).json({
                        message: "Invalid reset token",
                        error: true,
                        success: false
                    })
                }
            } catch (e) {
                return response.status(401).json({
                    message: "Reset token expired or invalid",
                    error: true,
                    success: false
                })
            }
        } else {
            if (user.signUpWithGoogle === false && !oldPassword) {
                return response.status(400).json({
                    message: "Provide required field oldPassword or resetToken",
                    error: true,
                    success: false
                })
            }

            if (user.signUpWithGoogle === false) {
                const checkPassword = await bcryptjs.compare(oldPassword, user.password);
                if (!checkPassword) {
                    return response.status(400).json({
                        message: "Your old password is wrong",
                        error: true,
                        success: false
                    })
                }
            }


            if (newPassword !== confirmPassword) {
                return response.status(400).json({
                    message: "newPassword and confirmPassword must be same",
                    error: true,
                    success: false
                })
            }

            const salt = await bcryptjs.genSalt(10)
            const hashPassword = await bcryptjs.hash(confirmPassword, salt)

            user.password = hashPassword;
            user.signUpWithGoogle = false;
            await user.save()


            return response.json({
                message: "Password updated successfully.",
                error: false,
                success: true
            })



        }
    }
    catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//refresh token controller
export async function refreshToken(request, response) {
    try {
        const refreshToken = request.cookies.refreshToken || request?.headers?.authorization?.split("")[1]

        if (!refreshToken) {
            return response.status(401).json({
                message: "Invalid Token",
                error: true,
                success: false
            })
        }

        const verifyToken = await jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN)
        if (!verifyToken) {
            return response.status(401).json({
                message: "Token is expired",
                error: true,
                success: false
            })
        }

        const userId = verifyToken?._id
        const newAccessToken = await generatedAccessToken(userId)

        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }

        response.cookie('accessToken', newAccessToken, cookiesOption)
        return response.json({
            message: "New Access token generated",
            error: false,
            success: true
        })


    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//get login user details
export async function userDetails(request, response) {
    // console.log("===== I am here")
    try {
        const userId = request.userId
        //console.log(userId)
        const user = await UserModel.findById(userId).select('-password -refresh_token')

        return response.json({
            message: "User details",
            data: user,
            error: false,
            success: true,
            status: 200
        })

    } catch (error) {
        return response.status(500).json({
            message: "Something is wrong",
            error: true,
            success: false
        })
    }
}


//add review
export async function addReview(request, response) {
    try {
        const { image, userName, rating, review, productId } = request.body
        if (!image || !userName || !rating || !review || !productId) {
            return response.status(400).json({
                message: "Provide required fields image, userName, rating, review, productId",
                error: true,
                success: false
            })
        }

        const userReview = new ReviewModel({
            image: image,
            userName: userName,
            rating: rating,
            review: review,
            productId: productId,
            userId: request.userId
        })

        await userReview.save();

        return response.json({
            message: "Review added successfully",
            data: userReview,
            error: false,
            success: true
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//getReview
export async function getReview(request, response) {
    try {
        const productId = request.query.productId;

        const reviews = await ReviewModel.find({ productId: productId }).sort({ createdAt: -1 })

        if (!reviews) {
            return response.status(404).json({
                message: "Review not found",
                error: true,
                success: false
            })
        }
        return response.status(200).json({
            message: "Review fetched successfully",
            reviews: reviews,
            error: false,
            success: true
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

