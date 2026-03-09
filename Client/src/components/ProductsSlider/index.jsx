import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';


// import required modules
import { Navigation, Autoplay } from 'swiper/modules';
import ProductItem from '../ProductItem';

const ProductsSlider = (props) => {
    return (
        <div className='ProductsSlider !mb-0'>
            <Swiper
                slidesPerView={props.items}
                spaceBetween={10}
                navigation={true}
                modules={[Navigation]}
                className="mySwiper productSlider"
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
                                <ProductItem item={item}/>
                            </SwiperSlide>
                        )
                    })
                }

            </Swiper>
        </div>
    )
}
export default ProductsSlider;