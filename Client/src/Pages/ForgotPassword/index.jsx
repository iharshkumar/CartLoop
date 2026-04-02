import React, { useContext, useState } from 'react'
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import { IoEyeOutline } from "react-icons/io5";
import { FaRegEyeSlash } from "react-icons/fa";
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import { MyContext } from '../../App';
import CircularProgress from '@mui/material/CircularProgress';
import { postData, hashPassword } from '../../utils/api';



const ForgotPassword = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isShowPassword2, setIsShowPassword2] = useState(false);

    const [formFields, setFormFields] = useState({
        email: localStorage.getItem("userEmail"),
        resetToken: localStorage.getItem("resetPasswordToken"),
        newPassword: '',
        confirmPassword: ''
    })

    const context = useContext(MyContext);
    const history = useNavigate()


    const onChangeInput = (e) => {
        const { name, value } = e.target;

        setFormFields(() => {
            return {
                ...formFields,
                [name]: value
            }
        });
    };


    const validateValue = Object.values(formFields).every(el => el)

    // console.log(formFields)
    const handleSubmit = async (e) => {

        e.preventDefault()

        setIsLoading(true)
        if (formFields.newPassword === "") {
            context.alertBox("error", "Please enter new password ")
            setIsLoading(false)
            return false
        }

        if (formFields.confirmPassword !== formFields.newPassword) {
            context.alertBox("error", "Password and confirm password doesn't match")
            setIsLoading(false)
            return false
        }


        const hashedNewPassword = await hashPassword(formFields.newPassword);
        const hashedConfirmPassword = await hashPassword(formFields.confirmPassword);
        
        const resetData = {
            ...formFields,
            newPassword: hashedNewPassword,
            confirmPassword: hashedConfirmPassword
        }

        postData(`/api/user/reset-password`, resetData, { credentials: 'include' }).then((res) => {
            // console.log(res)
            if (res?.error === false) {
                localStorage.removeItem("userEmail")
                localStorage.removeItem("actionType")
                localStorage.removeItem("resetPasswordToken")
                context.alertBox("success", res?.message)
                setIsLoading(false)
                history('/login')
            } else {
                context.alertBox("error", res?.message)
                setIsLoading(false)
            }

        })
    }
    return (
        <section className='section !py-10'>
            <div className='container'>
                <div className='card !shadow-md !w-full max-w-[400px] !m-auto !rounded-md !bg-white !p-4 !px-6 md:!px-12'>
                    <h3 className='text-center text-[20px] text-black'>
                        Forgot Password
                    </h3>
                    <form className='w-full !mt-5' onSubmit={handleSubmit}>
                        <FormControl variant="standard" className='w-full !mt-4 relative !text-black relative'>
                            <InputLabel htmlFor="password">
                                New Password
                            </InputLabel>
                            <Input
                                id="password"
                                type={isShowPassword === false ? 'password' : 'text'}
                                name="newPassword"
                                value={formFields.newPassword}
                                disabled={isLoading === true ? true : false}
                                onChange={onChangeInput}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <Button className='!absolute !right-[5px] !-top-[5px] !z-[10px] !w-[30px] !h-[30px] !min-w-[35px] !rounded-full 
                                       !text-black' onClick={() => setIsShowPassword(!isShowPassword)}>
                                            {
                                                isShowPassword === false ? <FaRegEyeSlash className='text-[20px] opacity-75' /> :
                                                    <IoEyeOutline className='text-[20px] opacity-75' />
                                            }
                                        </Button>
                                    </InputAdornment>
                                }
                            />

                        </FormControl>
                        <FormControl variant="standard" className='w-full !mt-4 relative !text-black'>
                            <InputLabel htmlFor="confirm_password">
                                Confirm Password
                            </InputLabel>
                            <Input
                                id="confirm_password"
                                type={isShowPassword2 === false ? 'password' : 'text'}
                                name="confirmPassword"
                                value={formFields.confirmPassword}
                                disabled={isLoading === true ? true : false}
                                onChange={onChangeInput}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <Button className='!absolute !right-[5px] !-top-[5px] !z-[10px] !w-[30px] !h-[30px] !min-w-[35px] !rounded-full 
                                       !text-black' onClick={() => setIsShowPassword2(!isShowPassword2)}>
                                            {
                                                isShowPassword2 === false ? <FaRegEyeSlash className='text-[20px] opacity-75' /> :
                                                    <IoEyeOutline className='text-[20px] opacity-75' />
                                            }
                                        </Button>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>


                        <div className='flex items-center w-full !mt-3 !mb-3'>
                            <Button type='submit'
                                disabled={!validateValue} className="btn-org btn-lg w-full !h-[40px] !min-h-[40px] !py-0">
                                {
                                    isLoading === true ? <CircularProgress color="inherit" />
                                        :
                                        "Change Password"
                                }
                            </Button>
                        </div>

                    </form>
                </div>
            </div>
        </section>
    )
}

export default ForgotPassword;