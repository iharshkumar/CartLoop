import React, { useEffect } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { MyContext } from '../../App';
import { useState } from 'react';
import { useContext } from 'react';
import { deleteImage, editData, fetchDataFromApi } from '../../utils/api';
import UploadBox from '../../Components/UploadBox';
import { Button, CircularProgress } from '@mui/material';
import { GrCloudUpload } from "react-icons/gr";
import { useNavigate } from 'react-router-dom';
import { IoMdClose } from 'react-icons/io';

const EditBannersV1 = () => {
    const [productCat, setProductCat] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const context = useContext(MyContext);
    const [previews, setPreviews] = useState([]);
    const [productThirdLevelCat, setProductThirdLevelCat] = useState('');
    const [productSubCat, setProductSubCat] = useState('');
    const history = useNavigate();
    const [alignInfo, setAlignInfo] = useState('');

    const [formFields, setFormFields] = useState({
        bannerTitle: '',
        catId: '',
        subCatId: '',
        thirdsubCatId: '',
        price: '',
        images: [],
        alignInfo: ''
    });

    // Derived filtered lists based on selections
    const selectedCat = context?.catData?.find(cat => cat._id === productCat);
    const subCatList = selectedCat?.children || [];
    const selectedSubCat = subCatList.find(sub => sub._id === productSubCat);
    const thirdLevelCatList = selectedSubCat?.children || [];

    useEffect(() => {
        const id = context.isOpenFullScreenPanel?.id;
        fetchDataFromApi(`/api/bannerV1/${id}`).then((res) => {
            const banner = res?.banner;
            if (!banner) return;

            setFormFields({
                bannerTitle: banner.bannerTitle || '',
                catId: banner.catId || '',
                subCatId: banner.subCatId || '',
                thirdsubCatId: banner.thirdsubCatId || '',
                price: banner.price || '',
                images: banner.images || [],
                alignInfo: banner.alignInfo
            });

            setProductCat(banner.catId || '');
            setProductSubCat(banner.subCatId || '');
            setProductThirdLevelCat(banner.thirdsubCatId || '');
            setPreviews(banner.images || []);
            setAlignInfo(banner.alignInfo);
        });
    }, []);

    const onChangeInput = (e) => {
        const { name, value } = e.target;
        setFormFields(prev => ({ ...prev, [name]: value }));
    };

    const handleChangeProductCat = (event) => {
        const val = event.target.value;
        setProductCat(val);
        setProductSubCat('');
        setProductThirdLevelCat('');
        setFormFields(prev => ({ ...prev, catId: val, subCatId: '', thirdsubCatId: '' }));
    };

    const handleChangeProductSubCat = (event) => {
        const val = event.target.value;
        setProductSubCat(val);
        setProductThirdLevelCat('');
        setFormFields(prev => ({ ...prev, subCatId: val, thirdsubCatId: '' }));
    };

    const handleChangeProductThirdLevelCat = (event) => {
        const val = event.target.value;
        setProductThirdLevelCat(val);
        setFormFields(prev => ({ ...prev, thirdsubCatId: val }));
    };

    const handleChangeALignInfo = (event) => {
        setAlignInfo(event.target.value);
        formFields.alignInfo = event.target.value;
    }

    const setPreviewsFun = (previewsArr) => {
        const imgArr = [...previews, ...previewsArr];
        setPreviews([]);
        setTimeout(() => {
            setPreviews(imgArr);
            setFormFields(prev => ({ ...prev, images: imgArr }));
        }, 10);
    };

    const removeImg = (image, index) => {
        deleteImage(`/api/bannerV1/deleteImage?img=${image}`).then(() => {
            const imageArr = [...previews];
            imageArr.splice(index, 1);
            setPreviews([]);
            setTimeout(() => {
                setPreviews(imageArr);
                setFormFields(prev => ({ ...prev, images: imageArr }));
            }, 100);
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formFields.bannerTitle) return context.alertBox("error", "Please enter Banner title");
        if (!formFields.catId) return context.alertBox("error", "Please select Category");
        if (!formFields.subCatId) return context.alertBox("error", "Please select Sub Category");
        if (!formFields.thirdsubCatId) return context.alertBox("error", "Please select Third Level Category");
        if (!formFields.price) return context.alertBox("error", "Please enter Banner price");
        if (previews.length === 0) return context.alertBox("error", "Please add a Banner image");

        setIsLoading(true);
        editData(`/api/bannerV1/${context.isOpenFullScreenPanel?.id}`, formFields).then((res) => {
            console.log("API Response:", res);
            if (res?.data?.error === false) {
                context.alertBox("success", "Banner updated successfully!");
                setTimeout(() => {
                    setIsLoading(false);
                    context.setIsOpenFullScreenPanel({ open: false });
                    history("/bannerV1/list");
                }, 1000);
            } else {
                setIsLoading(false);
                context.alertBox("error", "Something went wrong!");
            }
        });
    };

    return (
        <section className='!p-5 !bg-gray-100'>
            <form className='form !py-0 !p-8' onSubmit={handleSubmit}>
                <div className='scroll !min-h-[72vh] !overflow-y-scroll !pr-4 !pt-4'>
                    <div className='grid grid-cols-4 !mb-3 gap-4'>

                        <div className='col'>
                            <h3 className='!text-[18px] !font-[500] !mb-1 text-black-500'>Banner Title</h3>
                            <input
                                type="text"
                                className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] !rounded-sm !p-3 !text-sm !bg-[#fafafa]'
                                name="bannerTitle"
                                value={formFields.bannerTitle}
                                onChange={onChangeInput}
                            />
                        </div>

                        <div className='col'>
                            <h3 className='!text-[18px] !font-[500] !mb-1 text-black-500'>Banner Category</h3>
                            <Select
                                size='small'
                                className='w-full !bg-[#fafafa]'
                                value={productCat}
                                displayEmpty
                                onChange={handleChangeProductCat}
                            >
                                <MenuItem value="" disabled>Select Category</MenuItem>
                                {context?.catData?.map((cat, index) => (
                                    <MenuItem key={index} value={cat._id}>{cat.name}</MenuItem>
                                ))}
                            </Select>
                        </div>

                        <div className='col'>
                            <h3 className='!text-[18px] !font-[500] !mb-1 text-black-500'>Product Sub Category</h3>
                            <Select
                                size='small'
                                className='w-full !bg-[#fafafa]'
                                value={productSubCat}
                                displayEmpty
                                onChange={handleChangeProductSubCat}
                                disabled={!productCat}
                            >
                                <MenuItem value="" disabled>Select Sub Category</MenuItem>
                                {subCatList.map((subCat, index) => (
                                    <MenuItem key={index} value={subCat._id}>{subCat.name}</MenuItem>
                                ))}
                            </Select>
                        </div>

                        <div className='col'>
                            <h3 className='!text-[18px] !font-[500] !mb-1 text-black-500'>Product Third Level Category</h3>
                            <Select
                                size='small'
                                className='w-full !bg-[#fafafa]'
                                value={productThirdLevelCat}
                                displayEmpty
                                onChange={handleChangeProductThirdLevelCat}
                                disabled={!productSubCat}
                            >
                                <MenuItem value="" disabled>Select Third Level Category</MenuItem>
                                {thirdLevelCatList.map((thirdCat, index) => (
                                    <MenuItem key={index} value={thirdCat._id}>{thirdCat.name}</MenuItem>
                                ))}
                            </Select>
                        </div>

                        <div className='col'>
                            <h3 className='!text-[18px] !font-[500] !mb-1 text-black-500'>Price</h3>
                            <input
                                type="number"
                                className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] !rounded-sm !p-3 !text-sm !bg-[#fafafa]'
                                name="price"
                                value={formFields.price}
                                onChange={onChangeInput}
                            />
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
                    </div>
                    <br />

                    <h3 className='!text-[18px] !font-[500] !mb-0 text-black-500'>Image</h3>
                    <div className='grid grid-cols-7 gap-4'>
                        {previews.map((image, index) => (
                            <div key={index} className='uploadBoxWrapper relative'>
                                <span
                                    className='absolute w-[20px] h-[20px] !rounded-full !overflow-hidden !bg-red-500 -top-[5px] -right-[5px] flex items-center justify-center z-50 cursor-pointer'
                                    onClick={() => removeImg(image, index)}
                                >
                                    <IoMdClose className='text-white text-[17px]' />
                                </span>
                                <div className='uploadBox !p-0 !rounded-md !overflow-hidden !border !border-dashed !border-[rgba(0,0,0,0.3)] h-[150px] w-[100%] !bg-gray-100 cursor-pointer hover:!bg-gray-200 flex items-center justify-center flex-col relative'>
                                    <img src={image} className='w-100' alt={`banner-${index}`} />
                                </div>
                            </div>
                        ))}
                        <UploadBox multiple={true} url="/api/bannerV1/uploadImages" setPreviewsFun={setPreviewsFun} />
                    </div>

                    <br /><br />
                    <div className='w-[250px]'>
                        <Button type='submit' className='btn-blue btn-lg w-full flex gap-2'>
                            {
                                isLoading ? (
                                    <CircularProgress color="inherit" />
                                ) : (
                                    <>
                                        <GrCloudUpload className='text-[25px] text-white' />
                                        Publish and View
                                    </>
                                )
                            }
                        </Button>
                    </div>
                </div>
            </form>
        </section>
    );
};

export default EditBannersV1;