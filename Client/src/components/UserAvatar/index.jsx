import React, { useContext, useEffect, useState } from 'react'
import { IoCloudUpload } from "react-icons/io5";
import CircularProgress from '@mui/material/CircularProgress';
import { uploadImage } from '../../utils/api.js';
import { MyContext } from '../../App.jsx';

const UserAvatar = (props) => {
    const [previews, setPreviews] = useState([]);
    const [uploading, setUploading] = useState(false);
    const context = useContext(MyContext);

    useEffect(() => {
        const userAvtar = [];
        if (context?.userData?.avatar !== "" && context?.userData?.avatar !== undefined) {
            userAvtar.push(context?.userData?.avatar);
            setPreviews(userAvtar);
        }
    }, [context?.userData]);

    const onChangeFile = async (e) => {
        try {
            const files = e.target.files;
            if (!files || files.length === 0) return;

            setUploading(true);
            const formdata = new FormData();

            for (let i = 0; i < files.length; i++) {
                if (files[i] && (files[i].type === "image/jpeg" ||
                    files[i].type === "image/jpg" ||
                    files[i].type === "image/png" ||
                    files[i].type === "image/webp")
                ) {
                    formdata.append(`avatar`, files[i]);
                }
                else {
                    context.alertBox("error", "Please select a valid JPG, JPEG, or PNG image file");
                    setUploading(false);
                    return;
                }
            }

            uploadImage("/api/user/user-avatar", formdata).then((res) => {
                setUploading(false);
                if (res?.avtar) {
                    setPreviews([res.avtar]);
                    context.setUserData({
                        ...context.userData,
                        avatar: res.avtar
                    });
                }
            }).catch(err => {
                console.log(err);
                setUploading(false);
            });
        } catch (error) {
            console.log(error);
            setUploading(false);
        }
    };

    return (
        <div className={`w-full flex items-center justify-center flex-col ${props.className}`}>
            <div className='w-[110px] h-[110px] rounded-full !overflow-hidden !relative
                        group flex items-center justify-center bg-gray-200 border-2 border-gray-100 shadow-sm'>
                {
                    uploading === true ? <CircularProgress color='inherit' /> :
                        <>
                            {
                                previews?.length !== 0 ? previews?.map((img, index) => {
                                    return (
                                        <img
                                            src={img}
                                            key={index}
                                            className='w-full h-full object-cover'
                                            alt="avatar"
                                        />
                                    )
                                })
                                    :
                                    <img
                                        src={"/user.png"}
                                        className='w-full h-full object-cover'
                                        alt="default avatar"
                                    />
                            }
                        </>
                }

                <div className='overlay w-full h-full !absolute top-0 left-0 z-50 !bg-[rgba(0,0,0,0.7)] 
                            flex items-center justify-center cursor-pointer opacity-0 transition-all group-hover:opacity-100'>
                    <IoCloudUpload className='text-[#fff] text-[25px]' />
                    <input type="file"
                        className='absolute top-0 left-0 h-full w-full opacity-0 cursor-pointer'
                        accept='image/*'
                        onChange={onChangeFile}
                        name="avatar"
                    />
                </div>
            </div>
            {props.showDetails && context?.userData?.name && (
                <div className="text-center mt-3">
                    <h3 className="mb-0 text-[18px] font-bold">{context?.userData?.name}</h3>
                    <h6 className='text-[13px] font-[500] text-gray-500'>{context?.userData?.email}</h6>
                </div>
            )}
        </div>
    )
}

export default UserAvatar;
