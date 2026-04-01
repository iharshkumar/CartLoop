import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { FreeMode, Navigation } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { MyContext } from '../../App';
import { useContext } from 'react';

const HomeCatSlider = (props) => {

  const context = useContext(MyContext);

  return (
    <div className='homeCatSlider pb-10 md:pb-12' style={{ marginTop: '1rem', marginBottom: '1rem' }}>
      <div className='container !mt-0 !p-0 !px-2'>
        <Swiper
          slidesPerView={8}
          spaceBetween={10}
          navigation={context?.windowWidth > 992 ? true : false}
          modules={[Navigation, FreeMode]}
          className="mySwiper"
          freeMode={true}
          breakpoints={{
            300: {
              slidesPerView: 3,
              spaceBetween: 10
            },
            550: {
              slidesPerView: 4,
              spaceBetween: 10
            },
            900: {
              slidesPerView: 5,
              spaceBetween: 10
            },
            1024: {
              slidesPerView: 7,
              spaceBetween: 10
            }
          }}
        >
          {
            props?.data?.map((cat, index) => {
              return (
                <SwiperSlide key={index}>
                  <Link to="/">
                    <div className='item !py-7 !px-3 bg-white rounded-sm text-center flex items-center justify-center flex-col  '>
                      <img src={cat?.images[0]}
                        className='w-[40px] lg:w-[60px] transition-all' />
                      <h3 className='text-[12px] lg:text-[15px] font-[500] !mt-2'>
                        {cat?.name}
                      </h3>
                    </div>
                  </Link>
                </SwiperSlide>

              )
            })
          }
        </Swiper>
      </div>
    </div>
  )
}

export default HomeCatSlider;