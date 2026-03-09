import React, { useContext, useState } from 'react'
import UploadBox from '../../Components/UploadBox'
import { IoMdClose } from 'react-icons/io'
import { Button } from '@mui/material'
import { GrCloudUpload } from 'react-icons/gr'
import { MyContext } from '../../App'
import { deleteImage, postData } from '../../utils/api'
import CircularProgress from '@mui/material/CircularProgress';

const AddAdsBannerV2 = () => {
    const [isLoading, setIsLoading] = useState(false);
    const context = useContext(MyContext);
    const [previews, setPreviews] = useState([])

    const [formFields, setFormFields] = useState({
        images: [],
    })

    const setPreviewsFun = (previewsArr) => {
        const imgArr = previews;
        for (let i = 0; i < previewsArr.length; i++) {
            imgArr.push(previewsArr[i])
        }

        setPreviews([]);
        setTimeout(() => {
            setPreviews(imgArr);
            formFields.images = imgArr
        }, 10);
    }

    const removeImg = (image, index) => {
        var imageArr = [];
        imageArr = previews
        deleteImage(`/api/adsBannerV2/deleteImage?img=${image}`).then(() => {
            imageArr.splice(index, 1);
            setPreviews([]);

            setTimeout(() => {
                setPreviews(imageArr);
                formFields.images = imageArr
            }, 100)
        })
    }

    const handleSubmit = (e) => {

        e.preventDefault()

        setIsLoading(true)

        if (previews?.length === 0) {
            context.alertBox("error", "Please select Ads banner image");
            setIsLoading(false);
            return false
        }

        postData("/api/adsBannerV2/add", formFields).then((res) => {
            setTimeout(() => {
                setIsLoading(false);
                context.setIsOpenFullScreenPanel({
                    open: false,
                })
            }, 1500);
        })
    }

    return (
        <section className='!p-5 !bg-gray-100'>
            <form className='form !py-0 !p-8' onSubmit={handleSubmit}>
                <div className='scroll !min-h-[72vh] !overflow-y-scroll !pr-4 !pt-4'>
                    <div className='grid grid-cols-7 gap-4'>

                        {
                            previews.length !== 0 && previews?.map((image, index) => {
                                return (
                                    <div key={index} className='uploadBoxWrapper relative'>
                                        <span className='absolute w-[20px] h-[20px] !rounded-full !overflow-hidden !bg-red-500 -top-[5px] -right-[5px] flex items-center justify-center z-50 cursor-pointer'
                                            onClick={() => removeImg(image, index)}>
                                            <IoMdClose className='text-white text-[17px]' />
                                        </span>
                                        <div className='uploadBox !p-0 !rounded-md !overflow-hidden !border  !border-dashed !border-[rgba(0,0,0,0.3)] h-[150px] w-[100%] !bg-gray-100 cursor-pointer hover:!bg-gray-200 flex items-center justify-center flex-col relative'>
                                            <img src={image} className='w-100' />
                                        </div>
                                    </div>
                                )
                            })
                        }

                        <UploadBox multiple={true} url="/api/adsBannerV2/uploadImages" setPreviewsFun={setPreviewsFun} />

                    </div>

                    <br />
                    <br />
                    <div className='w-[250px]'>
                        <Button type='submit' className='btn-blue btn-lg w-full flex gap-2 '>
                            {
                                isLoading === true ? <CircularProgress color="inherit" />
                                    :
                                    <>
                                        <GrCloudUpload className='text-[25px] text-white' />
                                        Publish and View
                                    </>
                            }

                        </Button>
                    </div>
                </div>

            </form>
        </section>
    )
}

export default AddAdsBannerV2

