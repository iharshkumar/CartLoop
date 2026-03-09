import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import BannerBox from '../BannerBox';
import BannerBoxV2 from '../bannerBoxV2';
import { Navigation } from 'swiper/modules';
import { Link } from 'react-router-dom';

const AdsBannerSlider = (props) => {
    return (
        <div className='py-5 w-full' style={{ paddingTop: '30px' }}>
            <Swiper
                slidesPerView={props.items}
                spaceBetween={10}
                navigation={true}
                modules={[Navigation]}
                className="smlBtn"
                breakpoints={{
                    320: { slidesPerView: 1, spaceBetween: 10 },
                    640: { slidesPerView: 2, spaceBetween: 10 },
                    768: { slidesPerView: 3, spaceBetween: 10 },
                    1024: { slidesPerView: props.items > 4 ? 4 : props.items, spaceBetween: 10 },
                    1280: { slidesPerView: props.items, spaceBetween: 10 }
                }}
            >
                {
                    props?.data?.map((item, index) => {
                        return (
                            <SwiperSlide key={index}>
                                <BannerBoxV2 info={item?.alignInfo}
                                    item={item}
                                    image={item?.images[0]}
                                    link={'/'}
                                />
                            </SwiperSlide>
                        )
                    })
                }


            </Swiper>
        </div>


    )
}

export default AdsBannerSlider;