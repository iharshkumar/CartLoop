import React, { useContext, useEffect, useState } from 'react'
import HomeSlider from '../../components/HomeSlider';
import HomeCatSlider from '../../components/HomeCatSlider';
import { LiaShippingFastSolid } from 'react-icons/lia';
import AdsBannerSlider from '../../components/AdsBannerSlider';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ProductsSlider from '../../components/ProductsSlider';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Navigation } from 'swiper/modules';
import BlogItem from '../../components/BlogItem';
import HomeSliderV2 from '../../components/HomeSliderV2';
import BannerBoxV2 from '../../components/bannerBoxV2';
import AdsBannerSliderV2 from '../../components/AdsBannerSliderV2';
import { fetchDataFromApi } from '../../utils/api';
//import { useNavigate } from 'react-router-dom';
import { MyContext } from '../../App';
import ProductLoading from '../../components/ProductLoading';
import BannerLoading from '../../components/BannerLoading';



const Home = () => {
  const [value, setValue] = React.useState(0);
  const [homeSlidesData, setHomeSlidesData] = useState([])
  const context = useContext(MyContext);
  const [popularProductData, setPopularProductData] = useState([]);
  const [allProductsData, setAllProductsData] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bannerV1Data, setBannerV1Data] = useState([]);
  const [bannerV2Data, setBannerV2Data] = useState([]);
  const [adsBannerV1Data, setAdsBannerV1Data] = useState([]);
  const [adsBannerV2Data, setAdsBannerV2Data] = useState([]);
  const [blogData, setBlogData] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDataFromApi("/api/homeSlides/").then((res) => {
      setHomeSlidesData(res?.data)
    })
    fetchDataFromApi("/api/product/getAllProducts").then((res) => {
      setAllProductsData(res?.data)
    })
    fetchDataFromApi("/api/product/getAllFeaturedProducts").then((res) => {
      setFeaturedProducts(res?.products)
    })
    fetchDataFromApi("/api/bannerV1").then((res) => {
      setBannerV1Data(res?.data);
    })
    fetchDataFromApi("/api/bannerV2").then((res) => {
      if (res?.error === false) {
        setBannerV2Data(res?.data || []);
      }
    })
    fetchDataFromApi("/api/blog").then((res) => {
      setBlogData(res?.data);
    })
    fetchDataFromApi("/api/adsBannerV1").then((res) => {
      if (res?.error === false) {
        setAdsBannerV1Data(res?.data || []);
      }
    })
    fetchDataFromApi("/api/adsBannerV2").then((res) => {
      if (res?.error === false) {
        setAdsBannerV2Data(res?.data || []);
      }
    })

  }, []);

  useEffect(() => {
    fetchDataFromApi(`/api/product/getAllProductsByCatId/${context?.catData[0]?._id}`).then((res) => {
      if (res?.error === false) {
        setPopularProductData(res?.data)
      }
    })
  }, [context?.catData])

  const filterByCatId = (id) => {
    setPopularProductData([])
    fetchDataFromApi(`/api/product/getAllProductsByCatId/${id}`).then((res) => {
      if (res?.error === false) {
        setPopularProductData(res?.data)
      }
    })
  }

  return (
    <>
      <div className='min-h-[28vh] lg:!min-h-[42vh] relative'>
        {
          homeSlidesData?.length === 0 && <BannerLoading />
        }
        {
          homeSlidesData?.length !== 0 && <HomeSlider data={homeSlidesData} />
        }
      </div>

      {
        context?.catData?.length !== 0 && <HomeCatSlider data={context?.catData} />
      }

      <section className='bg-white !mt-0 !pb-4'>
        <div className='container'>
          <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4 !mb-6 lg:!mb-3'>
            <div className='leftSec'>
              <h2 className='text-[20px] font-[600] !mt-3 !mb-0'>Popular Products </h2>
              <p className='text-[15px] font-[300] !mt-0'>Do not miss the current offers until the end of March</p>
            </div>

            <div className='rightSec w-full md:w-[60%]'>
              <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable auto tabs example"
              >
                {
                  context?.catData?.length !== 0 && context?.catData?.map((cat) => (
                    <Tab
                      key={cat?._id}
                      label={cat?.name}
                      onClick={() => filterByCatId(cat?._id)}
                    />
                  ))
                }

              </Tabs>
            </div>
          </div>

          {
            popularProductData?.length === 0 && <ProductLoading />
          }

          {
            popularProductData?.length !== 0 && <ProductsSlider items={6} data={popularProductData} />
          }

        </div>

      </section>

      <section className='!py-6 !pb-0 !mb-0 !pb-5'>
        <div className='container flex flex-col lg:flex-row w-full mx-auto justify-start gap-5'>
          <div className='part1 w-full lg:w-[70%] hidden lg:block'>
            {
              allProductsData?.length !== 0 && <HomeSliderV2 data={allProductsData} />
            }
          </div>

          <div className='part2 w-full lg:w-[30%] lg:pl-5 flex items-center gap-5 justify-between flex-col '>
            {
              bannerV2Data?.length !== 0 && (() => {
                const leftBanner = bannerV2Data[0];
                const rightBanner = bannerV2Data[1];

                return (
                  <>
                    <div className="z-10 flex flex-col gap-4">
                      {leftBanner && (
                        <BannerBoxV2
                          info={leftBanner?.alignInfo}
                          image={leftBanner?.images?.[0]}
                          item={leftBanner}
                          linkText="SHOP NOW"
                          linkTo="/products"
                        />
                      )}

                      {rightBanner && (
                        <BannerBoxV2
                          info={rightBanner?.alignInfo}
                          image={rightBanner?.images?.[0]}
                          item={rightBanner}
                          linkText="EXPLORE"
                          linkTo="/products"
                        />
                      )}
                    </div>
                  </>
                );
              })()
            }
          </div>

        </div>
      </section>

      <section className="!w-full bg-white pt-12 md:pt-16 pb-8 md:pb-12" style={{ paddingTop: '30px' }}>
        <div className="container bg-white w-full">
          <div className="freeShippng w-full bg-gradient-to-r from-red-50 to-orange-50 flex 
          flex-col md:flex-row items-center justify-between gap-4 md:gap-8 rounded-lg p-4 md:p-10 mb-8 shadow-sm">
            <div className="col1 flex flex-row items-center gap-2 md:gap-5 w-full md:w-auto justify-center md:justify-start text-left">
              <LiaShippingFastSolid className='text-[40px] md:text-[60px] text-primary' />
              <span className='text-[16px] md:text-[24px] font-[600] uppercase whitespace-nowrap'>Free Shipping</span>
            </div>

            <div className="col2 flex-1 px-2 md:px-4 text-center md:text-left">
              <p className='text-[13px] md:text-[18px] mb-0 font-[500] leading-tight'>Enjoy free shipping on all orders over $50. Shop now and save!</p>
            </div>

            <div className="col3 w-full md:w-auto flex justify-center">
              <button className='bg-primary !text-black py-2 md:py-3 px-6 md:px-10 rounded-md font-[500] text-[14px] md:text-[18px] hover:bg-opacity-90 transition-all whitespace-nowrap'>
                Shop Now
              </button>
            </div>
          </div>

          {
            bannerV1Data?.length !== 0 && <AdsBannerSliderV2 items={4} data={bannerV1Data} />
          }


        </div>
      </section>

      <section className='bg-white pt-12 md:pt-16 pb-8 md:pb-12 !mb-0'>
        <div className='container bg-white flex flex-col gap-6'>
          <h2 className='text-[20px] font-[600]' style={{ paddingTop: '30px' }}>Latest Products </h2>
          <div className='flex flex-col gap-6'>

            {
              allProductsData?.length === 0 && <ProductLoading />
            }

            {
              allProductsData?.length !== 0 && <ProductsSlider items={6} data={allProductsData} />
            }

            {
              adsBannerV1Data?.length !== 0 && (
                <AdsBannerSlider items={3} data={adsBannerV1Data} />
              )
            }
          </div>
        </div>
      </section>

      <section className='bg-white pt-12 md:pt-16 pb-8 md:pb-12'>
        <div className='container bg-white flex flex-col gap-6'>
          <h2 className='text-[20px] font-[600]' style={{ paddingTop: '30px' }}>Featured Products</h2>
          <div className='flex flex-col gap-6'>

            {
              featuredProducts?.length === 0 && <ProductLoading />
            }

            {
              featuredProducts?.length !== 0 && <ProductsSlider items={6} data={featuredProducts} />
            }
            {
              adsBannerV2Data?.length !== 0 && (
                <AdsBannerSlider items={3} data={adsBannerV2Data} />
              )
            }
          </div>
        </div>
      </section>

      {
        blogData?.length !== 0 &&
        <section className='pt-12 md:pt-16 pb-16 md:pb-20 w-full bg-white blogSection'>
          <div className='container'>
            <h2 className="text-[20px] font-[600] mb-6" style={{ paddingTop: '30px' }}>From the Blogs</h2>
            <Swiper
              slidesPerView={4}
              spaceBetween={30}
              navigation={true}
              modules={[Navigation]}
              className="blogSlider"
              breakpoints={{
                320: { slidesPerView: 1, spaceBetween: 15 },
                640: { slidesPerView: 2, spaceBetween: 20 },
                768: { slidesPerView: 3, spaceBetween: 25 },
                1024: { slidesPerView: 4, spaceBetween: 30 }
              }}
            >
              {
                blogData?.map((item, index) => {
                  return (
                    <SwiperSlide key={index}>
                      <BlogItem item={item} />
                    </SwiperSlide>
                  )
                })
              }
            </Swiper>
          </div>
        </section>
      }



    </>
  )
}

export default Home;