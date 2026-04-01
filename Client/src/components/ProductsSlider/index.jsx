import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';


// import required modules
import { Navigation, Autoplay, FreeMode } from 'swiper/modules';
import ProductItem from '../ProductItem';
import { useContext } from 'react';
import { MyContext } from '../../App';

const ProductsSlider = (props) => {
    const context = useContext(MyContext);
    return (
        <div className='ProductsSlider !mb-0'>
            <Swiper
                slidesPerView={props.items}
                spaceBetween={10}
                navigation={context?.windowWidth > 992 ? true : false}
                modules={[Navigation, FreeMode]}
                freeMode={true}
                className="mySwiper productSlider"
                breakpoints={{
                    280: { slidesPerView: 2, spaceBetween: 10 },
                    500: { slidesPerView: 3, spaceBetween: 15 },
                    768: { slidesPerView: 4, spaceBetween: 20 },
                    1024: { slidesPerView: props.items > 4 ? 4 : props.items, spaceBetween: 20 },
                    1280: { slidesPerView: props.items > 5 ? 5 : props.items, spaceBetween: 25 }
                }}
            >
                {
                    props?.data?.map((item, index) => {
                        return (
                            <SwiperSlide key={index}>
                                <ProductItem item={item} />
                            </SwiperSlide>
                        )
                    })
                }

            </Swiper>
        </div>
    )
}
export default ProductsSlider;