import React from 'react'
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useContext } from 'react';
import { MyContext } from '../../App';


const BannerLoading = () => {
    const context = useContext(MyContext);
    return (
        <div className='homeSlider !pb-2 !pt-0 lg:pb-5 lg:pt-5 relative z-[99]'>
            <div className='container'>
                <Swiper
                    loop={true}
                    spaceBetween={10}
                    navigation={context?.windowWidth > 992 ? true : false}
                    modules={[Navigation, Autoplay]}
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false
                    }}
                    centeredSlides={true}
                    slidesPerView={1.1}
                    breakpoints={{
                        0: { slidesPerView: 1.1 },
                        320: { slidesPerView: 1.1 },
                        768: { slidesPerView: 1.1 },
                        1024: { slidesPerView: 1.1 },
                    }}
                    className="sliderHome !overflow-visible"
                >
                    {
                        [1, 2, 3].map((_, index) => {
                            return (
                                <SwiperSlide key={index}>
                                    <div className='item rounded-[20px] overflow-hidden'>
                                        <div className="flex items-center justify-center mb-3 w-full h-[250px] bg-gray-200 animate-pulse rounded-md">
                                            <svg className="w-11 h-11 text-gray-400" aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m3 16 5-7 6 6.5m6.5 2.5L16 13l-4.286 6M14 10h.01M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z" />
                                            </svg>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            )
                        })
                    }
                </Swiper>
            </div>
        </div>
    )
}

export default BannerLoading