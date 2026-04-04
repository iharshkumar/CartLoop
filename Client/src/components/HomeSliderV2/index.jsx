import React, { useState } from 'react';
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
                            <SwiperSlide key={index}>
                                <div className="item w-[full] rounded-md overflow-hidden relative">
                                    <SlideItem imgSrc={item?.bannerImages[0]} />

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

const SlideItem = ({ imgSrc }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div className='relative w-full h-full min-h-[250px] md:min-h-[350px] bg-gray-100'>
            {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center w-full h-full bg-gray-200 animate-pulse transition-opacity duration-500">
                    <svg className="w-11 h-11 text-gray-400" aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m3 16 5-7 6 6.5m6.5 2.5L16 13l-4.286 6M14 10h.01M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z" />
                    </svg>
                </div>
            )}
            <img 
                src={imgSrc}
                alt="Banner"
                className={`w-full h-full object-cover transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                loading="lazy"
                onLoad={() => setIsLoaded(true)}
            />
        </div>
    )
}

export default HomeSliderV2;
