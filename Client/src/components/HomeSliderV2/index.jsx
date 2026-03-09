import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import Button from '@mui/material/Button';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// import required modules
import { EffectFade, Navigation, Pagination, Autoplay } from 'swiper/modules';

const HomeSliderV2 = (props) => {
    return (
        <Swiper
            slidesPerView={1}
            spaceBetween={0}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            speed={600}
            loop={true}
            autoplay={{
                delay: 1800,
                disableOnInteraction: false,
            }}
            navigation={true}
            pagination={{
                clickable: true,
                type: 'bullets',
            }}
            modules={[EffectFade, Navigation, Pagination, Autoplay]}
            className="homeSliderV2"
        >

            {
                props?.data?.map((item, index) => {
                    if (item?.isDisplayOnHomeBanner === true) {
                        return (
                            <SwiperSlide>
                                <div className="item w-[full] rounded-md overflow-hidden relative">
                                    <img src={item?.bannerImages[0]} 
                                     />

                                    <div className='info absolute top-0 -right-[100%] opacity-0 w-[50%] h-[100%] z-50 p-8 flex items-center flex-col justify-center transition-all duration-700'>
                                        <h4 className='text-[18px] font-[500] w-full text-left mb-3 relative -right-[100%] opacity-0 '>
                                        {item?.bannerTitlename}
                                        </h4>
                                        <h2 className='text-[38px] font-[700] w-full relative -right-[100%] opacity-0'>
                                            {item?.name}
                                        </h2>
                                        <h3 className='flex items-center gap-3 text-[18px] font-[500] w-full text-left mt-3 mb-3 relative -right-[100%] opacity-0'>
                                            Starting At Only
                                            <span className='text-red-500 text-[40px] font-[700]'>&#8377; {item?.price}</span>
                                        </h3>
                                        <div className='w-[75%] px-2 absolute bottom-0 opacity-0 btn_' style={{ padding: '70px', transform: 'translateY(100%)' }}>
                                            <Button className='btn-org '>
                                                Shop Now
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        )
                    }

                })
            }
        </Swiper>
    );
};

export default HomeSliderV2;
