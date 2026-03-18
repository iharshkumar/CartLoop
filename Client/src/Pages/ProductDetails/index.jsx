import React, { useState } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Link } from 'react-router-dom';
import { ProductZoom } from '../../components/ProductZoom';

import ProductDetailsComponents from '../../components/ProductDetails';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { fetchDataFromApi } from '../../utils/api';
import ProductLoading from '../../components/ProductLoading';
import ProductsSlider from '../../components/ProductsSlider';
import CircularProgress from '@mui/material/CircularProgress';

import Reviews from './addReview.jsx';
import { useRef } from 'react';

export const ProductDetails = () => {
    const [reviewCount, setReviewCount] = useState(0);
    const [activeTab, setActiveTab] = useState(0);
    const { id } = useParams();
    const [productData, setProductData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const reviewSec = useRef();
    const [relatedProductData, setRelatedProductData] = useState([]);

    useEffect(() => {
        fetchDataFromApi(`/api/user/getReview?productId=${id}`).then((res) => {
            if (res?.error === false) {
                setReviewCount(res?.reviews?.length);
            }
        })
    }, [reviewCount]);

    useEffect(() => {
        setIsLoading(true);
        fetchDataFromApi(`/api/product/${id}`).then((res) => {

            if (res?.error === false) {
                setProductData(res?.product);
                fetchDataFromApi(`/api/product/getAllProductsBySubCatId/${res?.product?.subCatId}`).then((res) => {
                    if (res?.error === false) {
                        const filteredData = res?.data?.filter((item) => item._id !== id);
                        setRelatedProductData(filteredData);
                    }
                });
                setTimeout(() => {
                    setIsLoading(false);
                }, 1000);
            }
        });


        window.scrollTo(0, 0);
    }, [id]);

    const gotoReviewSection = () => {
        window.scrollTo({
            top: reviewSec.current.offsetTop - 170,
            behavior: 'smooth'
        })

        setTimeout(() => {
            setActiveTab(1);
        }, 10);
    }

    return (
        <>
            <div className='!py-4 !pb-0'>
                <div className='container !p-2 !pb-5'>
                    <Breadcrumbs aria-label="breadcrumb" >
                        <Link underline="hover" color="inherit" href="/" className='link transition text-[14px]'>
                            Home
                        </Link>
                        <Link
                            underline="hover"
                            color="inherit"
                            href={`/products?catId=${productData?.catId}`}
                            className='link transition !text-[14px]'
                        >
                            {productData?.category?.name || 'Category'}
                        </Link>
                        <Link
                            underline="hover"
                            className='link transition text-[14px]'
                        >
                            {productData?.name}
                        </Link>
                    </Breadcrumbs>
                </div>
            </div>
            <section className='!bg-white !py-5' >
                {
                    isLoading === true ?
                        <div className='flex items-center justify-center min-h-[300px]'>
                            <CircularProgress />
                        </div>
                        :
                        <>
                            <div className='container flex gap-15 items-center'>
                                <div className='productZoomContainer w-[30%] '>
                                    <ProductZoom images={productData?.images} />
                                </div>

                                <div className='productContent w-[70%] !pr-15 !pl=15'>
                                    <ProductDetailsComponents item={productData} reviewCount={reviewCount} gotoReviewSection={gotoReviewSection} />
                                </div>
                            </div>


                            <div className='container w-full !mt-8'>
                                <div className='flex items-center gap-7 !mb-5'>
                                    <span className={`link text-[16px] cursor-pointer font-[500] ${activeTab === 0 && 'text-red-500'}`}
                                        onClick={() => setActiveTab(0)}>
                                        Description
                                    </span>
                                    <span className={`link text-[16px] cursor-pointer font-[500] ${activeTab === 1 && 'text-red-500'}`}
                                        onClick={gotoReviewSection}
                                        ref={reviewSec}>
                                        Reviews({reviewCount})
                                    </span>
                                </div>

                                {
                                    activeTab === 0 &&
                                    <div className='shadow-md w-full !py-5 !p-8 rounded-md'>
                                        <p>{productData?.description}</p>
                                    </div>
                                }


                                {
                                    activeTab === 1 &&
                                    <div className='shadow-md w-[80%] !py-5 !p-8 rounded-md'>
                                        {
                                            productData?.length !== 0 &&
                                            <Reviews productId={productData?._id} setReviewCount={setReviewCount} />
                                        }
                                    </div>
                                }
                            </div>

                            {
                                relatedProductData?.length !== 0 &&
                                <div className='container !pt-3'>
                                    <h2 className='text-[20px] font-[600] !pb-5' style={{ paddingTop: '30px' }}>Related Products </h2>
                                    <div className='flex flex-col gap-6 !pb-0'>
                                        <ProductsSlider items={6} data={relatedProductData} />
                                    </div>
                                </div>
                            }
                        </>
                }
            </section>


        </>
    )
}

export default ProductDetails;