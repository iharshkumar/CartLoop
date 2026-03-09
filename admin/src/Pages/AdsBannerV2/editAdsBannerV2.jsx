import React, { useContext, useEffect, useState } from 'react'
import UploadBox from '../../Components/UploadBox'
import { IoMdClose } from 'react-icons/io'
import { Button } from '@mui/material'
import { GrCloudUpload } from 'react-icons/gr'
import { MyContext } from '../../App'
import { editData, fetchDataFromApi } from '../../utils/api'
import CircularProgress from '@mui/material/CircularProgress';

const EditAdsBannerV2 = () => {
    const [isLoading, setIsLoading] = useState(false);
    const context = useContext(MyContext);
    const [previews, setPreviews] = useState([])

    const [formFields, setFormFields] = useState({
        images: [],
    })

    useEffect(() => {
        const id = context.isOpenFullScreenPanel?.id;
        if (!id) return;

        fetchDataFromApi(`/api/adsBannerV2/${id}`).then((res) => {
            const banner = res?.banner || res?.data?.banner;
            if (!banner) return;

            setFormFields({
                images: banner.images || [],
            });
            setPreviews(banner.images || []);
        });
    }, [])

    const setPreviewsFun = (previewsArr) => {
        const imgArr = [...previews, ...previewsArr];
        setPreviews([]);
        setTimeout(() => {
            setPreviews(imgArr);
            setFormFields(prev => ({ ...prev, images: imgArr }));
        }, 10);
    }

    const removeImg = (image, index) => {
        const imageArr = previews.filter((_, i) => i !== index);
        setPreviews(imageArr);
        setFormFields(prev => ({ ...prev, images: imageArr }));
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (previews?.length === 0) {
            context.alertBox("error", "Please select Ads banner image");
            return;
        }

        setIsLoading(true)

        editData(`/api/adsBannerV2/${context?.isOpenFullScreenPanel?.id}`, formFields).then((res) => {
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
                                        Update Banner
                                    </>
                            }

                        </Button>
                    </div>
                </div>

            </form>
        </section>
    )
}

export default EditAdsBannerV2

