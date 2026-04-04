import React, { useContext, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';


// import required modules
import { Navigation, Autoplay } from 'swiper/modules';
import { MyContext } from '../../App';

const HomeSlider = (props) => {
    const context = useContext(MyContext)
    return (
        <div className='homeSlider !pt-0 lg:!pt-4 !pb-0 lg:!pb-4 relative z-[99]'>
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
                                    <SlideItem imgSrc={imgSrc} />
                                </SwiperSlide>
                            )
                        })
                    }
                </Swiper>
            </div>
        </div>
    )
}

const SlideItem = ({ imgSrc }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div className='item rounded-[20px] overflow-hidden relative min-h-[150px] md:min-h-[250px] bg-gray-100'>
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
                alt="Banner Slide"
                className={`w-full h-full object-cover transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                loading="lazy"
                onLoad={() => setIsLoaded(true)}
            />
        </div>
    )
}

export default HomeSlider;
