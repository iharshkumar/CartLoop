import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { MyContext } from '../../App';
import { useState } from 'react';
import { useContext } from 'react';
import { deleteImage, postData } from '../../utils/api';
import UploadBox from '../../Components/UploadBox';
import { Button, CircularProgress } from '@mui/material';
import { GrCloudUpload } from "react-icons/gr";
import { useNavigate } from 'react-router-dom';
import { IoMdClose } from 'react-icons/io';

const AddBannersV1 = () => {
    const [productCat, setProductCat] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const context = useContext(MyContext);
    const [previews, setPreviews] = useState([]);
    const [productThirdLevelCat, setProductThirdLevelCat] = useState('');
    const [alignInfo, setAlignInfo] = useState('');
    const [productSubCat, setProductSubCat] = useState('');
    const history = useNavigate()

    const [formFields, setFormFields] = useState({
        bannerTitle: '',
        catId: '',
        subCatId: '',
        thirdsubCatId: '',
        price: '',
        alignInfo: ''
    });

    const onChangeInput = (e) => {
        const { name, value } = e.target;
        setFormFields(() => {
            return {
                ...formFields,
                [name]: value
            }
        });
    }
    const handleChangeProductCat = (event) => {
        setProductCat(event.target.value);
        formFields.catId = event.target.value;
    };

    const handleChangeProductSubCat = (event) => {
        setProductSubCat(event.target.value);
        formFields.subCatId = event.target.value;
    };

    const handleChangeProductThirdLevelCat = (event) => {
        setProductThirdLevelCat(event.target.value);
        formFields.thirdsubCatId = event.target.value;
    };

    const handleChangeALignInfo=(event)=>{
        setAlignInfo(event.target.value);
        formFields.alignInfo = event.target.value;
    }

    const setPreviewsFun = (previewsArr) => {
        const imgArr = previews;
        for (let i = 0; i < previewsArr.length; i++) {
            imgArr.push(previews[i])
        }
        setPreviews([])
        setTimeout(() => {
            setPreviews(imgArr);
            formFields.images = imgArr
        }, 10);

    }

    const removeImg = (image, index) => {
        var imageArr = [];
        imageArr = previews
        deleteImage(`/api/bannerV1/deleteImage?img=${image}`).then(() => {
            imageArr.splice(index, 1);
            setPreviews([]);

            setTimeout(() => {
                setPreviews(imageArr);
                formFields.images = imageArr
            }, 100)
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault(0);

        if (formFields?.bannerTitle === "") {
            context.alertBox("error", "Please enter Banner title");
            setIsLoading(false);
            return false
        }

        if (formFields?.catId === "") {
            context.alertBox("error", "Please select Category");
            setIsLoading(false);
            return false
        }

        if (formFields?.subCatId === "") {
            context.alertBox("error", "Please select Sub Category");
            setIsLoading(false);
            return false
        }

        if (formFields?.thirdsubCatId === "") {
            context.alertBox("error", "Please select Third Level Category");
            setIsLoading(false);
            return false
        }

        if (formFields?.price === "") {
            context.alertBox("error", "Please enter Banner price");
            setIsLoading(false);
            return false
        }

        if (previews?.length === 0) {
            context.alertBox("error", "Please enter Banner image");
            setIsLoading(false);
            return false
        }


        setIsLoading(true);
        postData("/api/bannerV1/add", formFields).then((res) => {
            if (res?.error === false) {
                context.alertBox("success", res?.message);
                setTimeout(() => {
                    setIsLoading(false);
                    context.setIsOpenFullScreenPanel({
                        open: false
                    })
                    history("/bannerV1/list")
                }, 1000);
            } else {
                setIsLoading(false)
                context.alertBox("error", res?.message);
            }
        })
    }


    return (
        <section className='!p-5 !bg-gray-100'>
            <form className='form !py-0 !p-8' onSubmit={handleSubmit}>
                <div className='scroll !min-h-[72vh] !overflow-y-scroll !pr-4 !pt-4'>
                    <div className='grid grid-cols-4 !mb-3 gap-4'>
                        <div className='col '>
                            <h3 className='!text-[18px] !font-[500] !mb-1 text-black-500'>Banner Title</h3>
                            <input
                                type="text"
                                className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] !focus:outline-none !focus:border-[rgba(0,0,0,0.4)] !rounded-sm !p-3 !text-sm !bg-[#fafafa]'
                                name="bannerTitle"
                                value={formFields.bannerTitle}
                                onChange={onChangeInput}
                            />
                        </div>

                        <div className='col '>
                            <h3 className='!text-[18px] !font-[500] !mb-1 text-black-500'>Banner Category</h3>
                            {
                                context?.catData.length !== 0 &&
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="bannerCatDrop"
                                    size='small'
                                    className='w-full !bg-[#fafafa]'
                                    value={productCat}
                                    label="Category"
                                    onChange={handleChangeProductCat}
                                >
                                    {
                                        context?.catData.map((cat, index) => {
                                            return (
                                                <MenuItem key={index} value={cat?._id}>{cat?.name}</MenuItem>
                                            )
                                        })
                                    }
                                </Select>
                            }
                        </div>

                        <div className='col'>
                            <h3 className='!text-[18px] !font-[500] !mb-1 text-black-500'>Product Sub Category</h3>
                            {
                                context?.catData.length !== 0 &&
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="bannerSubCatDrop"
                                    size='small'
                                    className='w-full !bg-[#fafafa]'
                                    value={productSubCat}
                                    label="Sub Category"
                                    onChange={handleChangeProductSubCat}
                                >
                                    {
                                        context?.catData.map((cat, index_) => {
                                            return (
                                                cat?.children?.length !== 0 && cat?.children?.map((subCat) => {
                                                    return (
                                                        <MenuItem key={subCat?._id} value={subCat?._id}>{subCat?.name}</MenuItem>
                                                    )
                                                })
                                            )
                                        })
                                    }
                                </Select>
                            }

                        </div>

                        <div className='col'>
                            <h3 className='!text-[18px] !font-[500] !mb-1 text-black-500'>Product Third Level Category</h3>
                            {
                                context?.catData.length !== 0 &&
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="productThirdLevelCatDrop"
                                    size='small'
                                    className='w-full !bg-[#fafafa]'
                                    value={productThirdLevelCat}
                                    label="Third Level Category"
                                    onChange={handleChangeProductThirdLevelCat}
                                >
                                    {
                                        context?.catData.map((cat, index__) => {
                                            return (
                                                cat?.children?.length !== 0 && cat?.children?.map((subCat) => {
                                                    return (
                                                        subCat?.children?.length !== 0 && subCat?.children?.map((thirdLevelCat) => {
                                                            return (
                                                                <MenuItem
                                                                    value={thirdLevelCat?._id}
                                                                    key={thirdLevelCat?._id}
                                                                >
                                                                    {thirdLevelCat?.name}</MenuItem>
                                                            )
                                                        })
                                                    )
                                                })
                                            )
                                        })
                                    }
                                </Select>
                            }

                        </div>

                        <div className='col'>
                            <h3 className='!text-[18px] !font-[500] !mb-1 text-black-500'>Align Info</h3>
                            {
                                context?.catData.length !== 0 &&
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="productThirdLevelCatDrop"
                                    size='small'
                                    className='w-full !bg-[#fafafa]'
                                    value={alignInfo}
                                    label="Alignment"
                                    onChange={handleChangeALignInfo}
                                >
                                    <MenuItem
                                        value={"left"}>
                                        Left
                                    </MenuItem>
                                    <MenuItem
                                        value={"right"}>
                                        Right
                                    </MenuItem>

                                </Select>
                            }

                        </div>


                        <div className='col '>
                            <h3 className='!text-[18px] !font-[500] !mb-1 text-black-500'>Price</h3>
                            <input
                                type="number"
                                className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] !focus:outline-none !focus:border-[rgba(0,0,0,0.4)] !rounded-sm !p-3 !text-sm !bg-[#fafafa]'
                                name="price"
                                value={formFields.price}
                                onChange={onChangeInput}
                            />
                        </div>
                    </div>
                    <br />

                    <h3 className='!text-[18px] !font-[500] !mb-0 text-black-500'>Image</h3>


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



                        <UploadBox multiple={true} url="/api/bannerV1/uploadImages" setPreviewsFun={setPreviewsFun} />

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

export default AddBannersV1