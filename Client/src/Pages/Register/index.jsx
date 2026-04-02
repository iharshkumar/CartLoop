import React, { useState } from 'react'
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import { MdOutlineMail } from 'react-icons/md';
import { IoEyeOutline } from "react-icons/io5";
import { FaRegEyeSlash } from "react-icons/fa";
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import { AiFillApple } from "react-icons/ai";
import { BsFillPersonFill } from "react-icons/bs";
import { postData, hashPassword } from '../../utils/api';
import { useContext } from 'react';
import { MyContext } from '../../App';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom'
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from '../../firebase.jsx';
import { useEffect } from 'react';


const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

const Register = () => {

    const [isLoading, setIsLoading] = useState(false);

    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [formFields, setFormFields] = useState({
        name: "",
        email: "",
        password: ""
    })

    const context = useContext(MyContext)
    const history = useNavigate()


    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])
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
        if (formFields.name === "") {
            context.alertBox("error", "Please add full name")
            return false
        }

        if (formFields.email === "") {
            context.alertBox("error", "Please enter email id")
            return false
        }

        if (formFields.password === "") {
            context.alertBox("error", "Please enter password")
            return false
        }
        const hashedPassword = await hashPassword(formFields.password);
        const registerData = {
            ...formFields,
            password: hashedPassword
        }
        postData("/api/user/register", registerData).then((res) => {
            console.log(res)
            if (res?.error === false) {
                setIsLoading(false)
                context.alertBox("success", res?.message)
                localStorage.setItem("userEmail", formFields.email)
                localStorage.removeItem("actionType")
                setFormFields({
                    name: "",
                    email: "",
                    password: ""
                })
                history("/verify")
            } else {
                context.alertBox("error", res?.message)
                setIsLoading(false)
            }

        })
    }

    const authWithGoogle = () => {
        signInWithPopup(auth, googleProvider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                const fields = {
                    name: user.providerData[0].displayName,
                    email: user.providerData[0].email,
                    password: null,
                    avatar: user.providerData[0].photoURL,
                    mobile: user.providerData[0].phoneNumber,
                    role: "USER"
                }

                postData("/api/user/authWithGoogle", fields).then((res) => {
                    console.log(res)
                    if (res?.error === false) {
                        setIsLoading(false);
                        context.alertBox("success", res?.message);
                        localStorage.setItem("userEmail", fields.email);
                        localStorage.setItem("accesstoken", res?.data?.accesstoken);
                        localStorage.setItem("refreshToken", res?.data?.refreshToken);
                        context.setIsLogin(true)
                        history("/");
                    } else {
                        context.alertBox("error", res?.message);
                        setIsLoading(false);
                    }

                })
            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.customData.email;
                const credential = GoogleAuthProvider.credentialFromError(error);
            });
    }

    return (


        <section className='section !py-10'>
            <div className='container'>
                <div className='card !shadow-md !w-full max-w-[400px] !m-auto !rounded-md !bg-white !p-4 !px-6 md:!px-12'>
                    <h3 className='text-center text-[20px] text-black'>
                        Register with new Account
                    </h3>
                    <form className='w-full !mt-5' onSubmit={handleSubmit}>
                        <FormControl variant="standard"
                            className='w-full !mt-4 relative !text-black '
                        >
                            <InputLabel htmlFor="name">
                                Name
                            </InputLabel>
                            <Input
                                id="Name"
                                type="text"
                                name="name"
                                value={formFields.name}
                                disabled={isLoading === true ? true : false}
                                onChange={onChangeInput}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <BsFillPersonFill className='!absolute !right-[10px] !-top-[5px] !z-[10px] !w-[30px] !h-[20px] !min-w-[20px]  !rounded-full 
                                       !text-black !opacity-75' />
                                    </InputAdornment>
                                }
                            />
                        </FormControl>

                        <FormControl variant="standard" className='w-full !mt-4 relative !text-black'>
                            <InputLabel htmlFor="email">
                                Email Id
                            </InputLabel>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                onChange={onChangeInput}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <MdOutlineMail className='!absolute !right-[10px] !-top-[5px] !z-[10px] !w-[30px] !h-[20px] !min-w-[20px]  !rounded-full 
                                       !text-black !opacity-75' />
                                    </InputAdornment>
                                }
                            />
                        </FormControl>



                        <FormControl variant="standard" className='w-full !mt-4 relative !text-black'>
                            <InputLabel htmlFor="password">
                                Password
                            </InputLabel>
                            <Input
                                id="password"
                                type={isShowPassword === false ? 'password' : 'text'}
                                name="password"
                                // onChange={onChangeInput}
                                value={password}
                                onChange={(ev) => {
                                    // 1. Call your generic handler
                                    onChangeInput(ev);

                                    // 2. Update local state and run validation
                                    const val = ev.target.value;
                                    setPassword(val);

                                    if (confirmPassword && val !== confirmPassword) {
                                        setPasswordError('Passwords do not match');
                                    } else {
                                        setPasswordError('');
                                    }
                                }}
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


                        <div className='flex items-center w-full !mt-3 !mb-3'>
                            <Button type='submit'
                                disabled={!validateValue} className="btn-org btn-lg w-full !h-[40px] !min-h-[40px] !py-0">
                                {
                                    isLoading === true ? <CircularProgress color="inherit" />
                                        :
                                        "Register"
                                }
                            </Button>
                        </div>

                        <p className='text-center'>Already Registered?  <Link className='link text-[14px] font-[5000] !text-[#ff5252]' to="/login">Login</Link></p>

                        <p className='text-center font-[500] !mb-5'> Or continue with social account</p>
                        <Button className='flex w-full gap-3 !bg-[#f1f1f1] btn-lg !text-black !mb-3' onClick={authWithGoogle}> <FcGoogle className='text-[20px]' /> Sign In With Google</Button>
                        {/* <Button className='flex w-full gap-3 !bg-[#f1f1f1] btn-lg !text-black !mb-3'> <AiFillApple className='text-[20px]' /> Login With Apple Id</Button> */}

                    </form>
                </div>
            </div>
        </section>
    )
}

export default Register;