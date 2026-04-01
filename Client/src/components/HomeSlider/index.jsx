import React, { useContext } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';


// import required modules
import { Navigation, Autoplay } from 'swiper/modules';
import { MyContext } from '../../App';

const HomeSlider = (props) => {
    const context = useContext(MyContext)
    return (
        <div className='homeSlider !pt-2 lg:!pt-4 !pb-1 lg:!pb-1'>
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
                        props?.data?.length !== 0 && props?.data?.map((item, index) => {
                            const imgSrc = Array.isArray(item?.images) ? item?.images?.[0] : item?.images;
                            return (
                                <SwiperSlide key={index}>
                                    <div className='item rounded-[20px] overflow-hidden'>
                                        <img src={imgSrc}
                                            alt="Banner Slide"
                                            className='w-full h-full object-cover'
                                            loading="lazy"
                                        />
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

export default HomeSlider;
