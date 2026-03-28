import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { FiGift } from "react-icons/fi";
import { Navigation } from 'swiper/modules';
import { IoStatsChartSharp } from "react-icons/io5";
import { IoPieChart } from "react-icons/io5";
import { AiOutlineBank } from "react-icons/ai";
import { BsCart4 } from "react-icons/bs";

const DashboardBoxes = (props) => {
    return (
        <Swiper
            slidesPerView={4}
            spaceBetween={10}
            navigation={true}
            modules={[Navigation]}
            className="dashboardBoxesSlider"
        >
            <SwiperSlide>
                <div className='box !p-5 !bg-white cursor-pointer hover:!bg-[#fafafa] !rounded-md !border !border-[rgba(0,0,0,0.1)] flex
                items-center gap-4'>
                    <FiGift className='text-[50px] text-[#3872fa]' />
                    <div className='info w-[70%] '>
                        <h3>Total Users</h3>
                        <b>{props?.users}</b>
                    </div>
                    <IoStatsChartSharp className='text-[50px] text-[#3872fa]' />
                </div>
            </SwiperSlide>


            <SwiperSlide>
                <div className='box !bg-white !p-5 cursor-pointer hover:!bg-[#fafafa] !rounded-md !border !border-[rgba(0,0,0,0.1)] flex
                items-center gap-4'>
                    <IoPieChart className='text-[50px] text-[#10b981]' />
                    <div className='info w-[70%] '>
                        <h3>New Orders</h3>
                        <b>{props?.orders}</b>
                    </div>
                    <IoStatsChartSharp className='text-[50px] text-[#10b981]' />
                </div>
            </SwiperSlide>


            <SwiperSlide>
                <div className='box !bg-white !p-5 cursor-pointer hover:!bg-[#fafafa] !rounded-md !border !border-[rgba(0,0,0,0.1)] flex
                items-center gap-4'>
                    <AiOutlineBank className='text-[50px] text-[#ff5252]' />
                    <div className='info w-[70%] '>
                        <h3>Total Category</h3>
                        <b>{props?.category}</b>
                    </div>
                    <IoStatsChartSharp className='text-[50px] text-[#ff5252]' />
                </div>
            </SwiperSlide>

            <SwiperSlide>
                <div className='box !bg-white !p-5 cursor-pointer hover:!bg-[#fafafa] !rounded-md !border !border-[rgba(0,0,0,0.1)] flex
                items-center gap-4'>
                    <BsCart4 className='text-[50px] text-[#7928ca]' />
                    <div className='info w-[70%] '>
                        <h3>Total Product</h3>
                        <b>{props?.products}</b>
                    </div>
                    <IoStatsChartSharp className='text-[50px] text-[#7928ca]' />
                </div>
            </SwiperSlide>
        </Swiper>
    )
}

export default DashboardBoxes