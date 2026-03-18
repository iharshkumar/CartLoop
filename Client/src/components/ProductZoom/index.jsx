import React, { useRef, useState } from 'react';
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/styles.min.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Navigation } from "swiper/modules";


export const ProductZoom = (props) => {

    const [slideIndex, setSlideIndex] = useState(0);
    const zoomSliderBig = useRef();
    const zoomSliderSml = useRef();

    const goto = (index) => {
        setSlideIndex(index);
        zoomSliderSml.current.swiper.slideTo(index);
        zoomSliderBig.current.swiper.slideTo(index);
    }

    const handleSlideChange = (swiper) => {
        const activeIndex = swiper.activeIndex;
        setSlideIndex(activeIndex);
        if (zoomSliderSml.current && zoomSliderSml.current.swiper) {
            zoomSliderSml.current.swiper.slideTo(activeIndex);
        }
    }

    return (
        <>
            <div className='flex gap-3'>
                <div className="slider w-[15%]">
                    <Swiper
                        ref={zoomSliderSml}
                        direction={'vertical'}
                        slidesPerView={4}
                        spaceBetween={0}
                        navigation={true}
                        modules={[Navigation]}
                        className={`zoomProductSliderThumbs !h-[440px] !overflow-hidden  ${props?.images?.length > 5 && 'space'}`}
                    >
                        {
                            props?.images?.map((item, index) => {
                                return (
                                    <SwiperSlide key={index}>
                                        <div className={`item !rounded-md !overflow-hidden cursor-pointer group transition-all 
                                         ${slideIndex === index ? '!opacity-100' : '!opacity-30 '}`}
                                            onClick={() => goto(index)}>
                                            <img src={item}
                                                className='w-full transition-all group-hover:scale-105'
                                            />
                                        </div>
                                    </SwiperSlide>

                                )
                            })
                        }
                    </Swiper>
                </div>

                <div className='zoomContainer w-[90%] !h-[460px] overflow-hidden !rounded-md'>
                    <Swiper
                        ref={zoomSliderBig}
                        slidesPerView={1}
                        spaceBetween={0}
                        navigation={false}
                        onSlideChange={handleSlideChange}
                    >

                        {
                            props?.images?.map((item, index) => (
                                <SwiperSlide key={index}>
                                    <InnerImageZoom
                                        zoomType="hover"
                                        zoomScale={1}
                                        src={item}
                                    />
                                </SwiperSlide>
                            ))
                        }


                    </Swiper>
                </div>
            </div>
        </>
    )
}
