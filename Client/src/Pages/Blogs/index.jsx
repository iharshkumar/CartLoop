import React, { useEffect, useState } from 'react';
import { fetchDataFromApi } from '../../utils/api';
import BlogItem from '../../components/BlogItem';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Link } from 'react-router-dom';
import { IoCalendarOutline } from "react-icons/io5";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

const BlogsPage = () => {
    const [blogData, setBlogData] = useState([]);
    const [featuredBlog, setFeaturedBlog] = useState(null);
    const [otherBlogs, setOtherBlogs] = useState([]);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchDataFromApi("/api/blog").then((res) => {
            if (res?.error === false) {
                setBlogData(res?.data);
                if (res?.data?.length > 0) {
                    setFeaturedBlog(res?.data[0]);
                    setOtherBlogs(res?.data?.slice(1));
                }
            }
        });
    }, []);

    return (
        <section className='!pt-10 !pb-20 w-full bg-[#f8fbff]'>
            <div className='container max-w-[1100px] mx-auto !px-4'>
                {
                    featuredBlog && (
                        <div className="featuredBlog !mb-24 animate-fade-in bg-white rounded-[32px] !p-8 md:!p-14 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-50">
                            <div className="blogHeader !mb-12 flex flex-col items-center justify-center w-full text-center px-4">
                                <span className='inline-flex items-center text-red-500 bg-red-50 !px-4 !py-1.5 rounded-full text-[12px] font-[700] uppercase tracking-widest gap-2 !mb-6'>
                                    <IoCalendarOutline className='text-[16px]' />
                                    {featuredBlog?.createdAt?.split("T")[0]}
                                </span>
                                <h1 className="text-[36px] md:text-[54px] font-[900] text-gray-900 !mb-8 tracking-tight !text-center w-full" style={{ textAlign: 'center', margin: '0 auto' }}>
                                    {featuredBlog?.title}
                                </h1>
                            </div>

                            <div className="imageContainer flex justify-center !mb-14">
                                <div className="imageWrapper w-full md:w-[85%] lg:w-[75%] overflow-hidden rounded-3xl shadow-2xl relative">
                                    <img
                                        src={featuredBlog?.images?.[0]}
                                        className="w-full object-cover max-h-[550px] transition-transform duration-700 hover:scale-[1.02]"
                                        alt={featuredBlog?.title}
                                    />
                                    <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-3xl pointer-events-none"></div>
                                </div>
                            </div>

                            <div className="blogContent flex justify-center w-full">
                                <div
                                    className="editorial-text !text-center text-[19px] leading-[1.85] text-gray-700 font-serif space-y-6 w-full max-w-[800px]"
                                    dangerouslySetInnerHTML={{ __html: featuredBlog?.description }}
                                    style={{ textAlign: 'center', margin: '0 auto' }}
                                />
                            </div>
                        </div>
                    )
                }

                {
                    otherBlogs?.length !== 0 && (
                        <div className="otherBlogsSection">
                            <div className="flex items-end justify-between !mb-12 !px-2">
                                <div className="leftSec text-left">
                                    <h3 className="text-[28px] font-[800] text-gray-900 !mb-2 tracking-tight line-[1]">Discover More</h3>
                                    <div className="h-1 w-12 bg-red-500 rounded-full"></div>
                                </div>
                                <Link to="/blogs" className="group text-gray-400 hover:text-red-500 font-[700] text-[13px] uppercase tracking-widest flex items-center gap-2 transition-all">
                                    Full Archive <MdOutlineKeyboardArrowRight className="text-[20px] transition-transform group-hover:translate-x-1" />
                                </Link>
                            </div>

                            <Swiper
                                slidesPerView={4}
                                spaceBetween={35}
                                navigation={true}
                                modules={[Navigation]}
                                className="blogSlider !pt-4 !pb-12"
                                breakpoints={{
                                    320: { slidesPerView: 1, spaceBetween: 20 },
                                    640: { slidesPerView: 2, spaceBetween: 25 },
                                    768: { slidesPerView: 3, spaceBetween: 30 },
                                    1024: { slidesPerView: 4, spaceBetween: 35 }
                                }}
                            >
                                {
                                    otherBlogs.map((item, index) => (
                                        <SwiperSlide key={index}>
                                            <div className="hover-card transition-all duration-400">
                                                <BlogItem item={item} />
                                            </div>
                                        </SwiperSlide>
                                    ))
                                }
                            </Swiper>
                        </div>
                    )
                }
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .editorial-text * { 
                    text-align: center !important;
                }
                .blogHeader h1 {
                    text-align: center !important;
                    display: block !important;
                    width: 100% !important;
                }
                .editorial-text p { 
                    margin-bottom: 2rem; 
                    color: #374151;
                    font-family: 'Inter', system-ui, -apple-system, sans-serif;
                }
                .editorial-text b, .editorial-text strong { color: #111827; }
                
                .blogSlider .swiper-button-next, 
                .blogSlider .swiper-button-prev {
                    background: #fff;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.06);
                    color: #111827;
                    border: 1px solid #f3f4f6;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .blogSlider .swiper-button-next:hover, 
                .blogSlider .swiper-button-prev:hover {
                    background: #ff5252;
                    color: #fff;
                    border-color: #ff5252;
                    transform: scale(1.1);
                    box-shadow: 0 15px 30px rgba(255,82,82,0.25);
                }
                .blogSlider .swiper-button-next:after, 
                .blogSlider .swiper-button-prev:after {
                    font-size: 16px;
                    font-weight: 900;
                }
                .animate-fade-in {
                    animation: fadeIn 1.2s cubic-bezier(0.215, 0.61, 0.355, 1) forwards;
                }
                .hover-card:hover {
                    transform: translateY(-8px);
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }`
            }} />
        </section>
    );
};

export default BlogsPage;
