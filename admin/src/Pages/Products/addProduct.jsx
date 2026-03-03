import React, { useEffect, useState } from 'react'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Rating from '@mui/material/Rating';
import UploadBox from '../../Components/UploadBox';
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'
import { IoMdClose } from 'react-icons/io'
import { Button, CircularProgress } from '@mui/material';
import { GrCloudUpload } from "react-icons/gr";
import { MyContext } from '../../App';
import { useContext } from 'react';
import { deleteImage, fetchDataFromApi, postData } from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const [isLoading, setIsLoading] = useState(false)
  const history = useNavigate();
  const context = useContext(MyContext);
  const [previews, setPreviews] = useState([])



  const [formFields, setFormFields] = useState({
    name: '',
    description: '',
    images: [],
    brand: '',
    price: '',
    oldPrice: '',
    category: "",
    catName: '',
    catId: '',
    subCatId: '',
    subCat: '',
    thirdsubCat: '',
    thirdsubCatId: '',
    countInStock: '',
    rating: '',
    isFeatured: false,
    discount: '',
    productRam: [],
    size: [],
    productWeight: [],
  })




  const [productCat, setProductCat] = useState('');
  const [productSubCat, setProductSubCat] = useState('');
  const [productFeatured, setProductFeatured] = useState('');
  const [productRams, setProductRams] = useState([]);
  const [productRamsData, setProductRamsData] = useState([]);
  const [productWeight, setProductWeight] = useState([]);
  const [productWeightData, setProductWeightData] = useState([]);
  const [productSize, setProductSize] = useState([]);
  const [productSizeData, setProductSizeData] = useState([]);

  const [productThirdLevelCat, setProductThirdLevelCat] = useState('');

  useEffect(() => {
    fetchDataFromApi(`/api/product/productRAMS/get`).then((res) => {
      if (res?.error === false) {
        setProductRamsData(res?.data);
      }
    })



    fetchDataFromApi(`/api/product/productWEIGHT/get`).then((res) => {
      if (res?.error === false) {
        setProductWeightData(res?.data);
      }
    })


    fetchDataFromApi(`/api/product/productSIZE/get`).then((res) => {
      if (res?.error === false) {
        setProductSizeData(res?.data);
      }
    })
  }, [])

  const handleChangeProductCat = (event) => {
    setProductCat(event.target.value);
    formFields.catId = event.target.value;
    formFields.category = event.target.value;

  };

  const selectCatByName = (name) => {
    formFields.catName = name;
  }

  const handleChangeProductSubCat = (event) => {
    setProductSubCat(event.target.value);
    formFields.subCatId = event.target.value;
  };

  const selectSubCatByName = (name) => {
    formFields.subCat = name;
  }


  const handleChangeProductThirdLevelCat = (event) => {
    setProductThirdLevelCat(event.target.value);
    formFields.thirdsubCatId = event.target.value;
  };

  const selectSubCatThirdLevel = (name) => {
    formFields.thirdsubCat = name;
  }

  const handleChangeProductFeatured = (event) => {
    setProductFeatured(event.target.value);
    formFields.isFeatured = event.target.value;
  };

  const handleChangeProductRams = (event) => {
    const {
      target: { value },
    } = event;
    setProductRams(
      typeof value === "string" ? value.split(",") : value
    );
    formFields.productRam = value;
  };


  const handleChangeProductWeight = (event) => {
    const {
      target: { value },
    } = event;
    setProductWeight(
      typeof value === "string" ? value.split(",") : value
    );
    formFields.productWeight = value;
  };


  const handleChangeProductSize = (event) => {
    const {
      target: { value },
    } = event;
    setProductSize(
      typeof value === "string" ? value.split(",") : value
    );
    formFields.size = value;
  };



  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormFields(() => {
      return {
        ...formFields,
        [name]: value
      }
    });
  }

  const onChangeRating = (e) => {
    setFormFields(() => (
      {
        ...formFields,
        rating: e.target.value
      }
    ))
  }


  const setPreviewsFun = (previewsArr) => {
    setPreviews(previewsArr);
    formFields.images = previewsArr
  }

  const removeImg = (image, index) => {
    var imageArr = [];
    imageArr = previews
    deleteImage(`/api/category/deleteImage?img=${image}`).then(() => {
      imageArr.splice(index, 1);
      setPreviews([]);

      setTimeout(() => {
        setPreviews(imageArr);
        formFields.images = imageArr
      }, 100)
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault(0);

    if (formFields?.name === "") {
      context.alertBox("error", "Please enter Product name");
      setIsLoading(false);
      return false
    }

    if (formFields?.description === "") {
      context.alertBox("error", "Please enter Product description");
      setIsLoading(false);
      return false
    }

    if (formFields?.catName === "") {
      context.alertBox("error", "Please enter Product Category");
      setIsLoading(false);
      return false
    }

    if (formFields?.brand === "") {
      context.alertBox("error", "Please enter Product brand");
      setIsLoading(false);
      return false
    }

    if (formFields?.price === "") {
      context.alertBox("error", "Please enter Product price");
      setIsLoading(false);
      return false
    }

    if (formFields?.oldPrice === "") {
      context.alertBox("error", "Please enter Product old Price");
      setIsLoading(false);
      return false
    }

    if (formFields?.catName === "") {
      context.alertBox("error", "Please select Category Name");
      setIsLoading(false);
      return false
    }

    if (formFields?.catId === "") {
      context.alertBox("error", "Please select Category Id");
      setIsLoading(false);
      return false
    }

    if (formFields?.countInStock === "") {
      context.alertBox("error", "Please enter product count");
      setIsLoading(false);
      return false
    }

    if (formFields?.rating === "") {
      context.alertBox("error", "Please enter product Rating");
      setIsLoading(false);
      return false
    }

    if (formFields?.discount === "") {
      context.alertBox("error", "Please enter discount");
      setIsLoading(false);
      return false
    }

    if (previews?.length === 0) {
      context.alertBox("error", "Please enter Product image");
      setIsLoading(false);
      return false
    }


    setIsLoading(true);
    postData("/api/product/create", formFields).then((res) => {
      if (res?.error === false) {
        context.alertBox("success", res?.message);
        setTimeout(() => {
          setIsLoading(false);
          context.setIsOpenFullScreenPanel({
            open: false
          })
          history("/products")
        }, 1000);
      } else {
        setIsLoading(false)
        context.alertBox("error", res?.message);
      }
    })
  }




  return (
    <section className='!p-5 !bg-gray-100'>
      <form className='form !py-0 !p-8' onSubmit={handleSubmit}>
        <div className='scroll !min-h-[72vh] !overflow-y-scroll !pr-2'>
          <div className='grid grid-cols-1 !mb-3'>
            <div className='col'>
              <h3 className='text-[14px] font-[500] !mb-1'>Product Name</h3>
              <input
                type="text"
                className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] !focus:outline-none !focus:border-[rgba(0,0,0,0.4)] !rounded-sm !p-3 !text-sm !bg-[#fafafa]'
                name="name"
                value={formFields.name}
                onChange={onChangeInput}
              />
            </div>
          </div>


          <div className='grid grid-cols-1 !mb-3'>
            <div className='col'>
              <h3 className='text-[14px] font-[500] !mb-1'>Product Description</h3>
              <textarea
                type="text"
                className='w-full h-[140px] border border-[rgba(0,0,0,0.2)] !focus:outline-none !focus:border-[rgba(0,0,0,0.4)] !rounded-sm !p-3 !text-sm !bg-[#fff]'
                name="description"
                value={formFields.description}
                onChange={onChangeInput} />
            </div>
          </div>

          <div className='grid grid-cols-4 !mb-3 gap-4'>
            <div className='col'>
              <h3 className='text-[14px] font-[500] !mb-1'>Product Category</h3>
              {
                context?.catData.length !== 0 &&
                <Select
                  labelId="demo-simple-select-label"
                  id="productCatDrop"
                  size='small'
                  className='w-full !bg-[#fafafa]'
                  value={productCat}
                  label="Category"
                  onChange={handleChangeProductCat}
                >
                  {
                    context?.catData.map((cat) => {
                      return (
                        <MenuItem key={cat?._id} value={cat?._id}
                          onClick={() =>
                            selectCatByName(cat?.name)
                          }>{cat?.name}</MenuItem>
                      )
                    })
                  }
                </Select>
              }

            </div>



            <div className='col'>
              <h3 className='text-[14px] font-[500] !mb-1'>Product Sub Category</h3>
              {
                context?.catData.length !== 0 &&
                <Select
                  labelId="demo-simple-select-label"
                  id="productSubCatDrop"
                  size='small'
                  className='w-full !bg-[#fafafa]'
                  value={productSubCat}
                  label="Sub Category"
                  onChange={handleChangeProductSubCat}
                >
                  {
                    context?.catData.map((cat) => {
                      return (
                        cat?.children?.length !== 0 && cat?.children?.map((subCat) => {
                          return (
                            <MenuItem key={subCat?._id} value={subCat?._id}
                              onClick={() =>
                                selectSubCatByName(subCat?.name)
                              }
                            >{subCat?.name}</MenuItem>
                          )
                        })
                      )
                    })
                  }
                </Select>
              }

            </div>

            <div className='col'>
              <h3 className='text-[14px] font-[500] !mb-1'>Product Third Level Category</h3>
              {
                context?.catData.length !== 0 &&
                <Select
                  labelId="demo-simple-select-label"
                  id="productThirdLevelCatDrop"
                  size='small'
                  className='w-full !bg-[#fafafa]'
                  value={productThirdLevelCat}
                  label="Third Level Category"
                  onChange={handleChangeProductThirdLevelCat}
                >
                  {
                    context?.catData.map((cat) => {
                      return (
                        cat?.children?.length !== 0 && cat?.children?.map((subCat) => {
                          return (
                            subCat?.children?.length !== 0 && subCat?.children?.map((thirdLevelCat) => {
                              return (
                                <MenuItem
                                  value={thirdLevelCat?._id}
                                  key={thirdLevelCat?._id}
                                  onClick={() => selectSubCatThirdLevel(thirdLevelCat?.name)}
                                >
                                  {thirdLevelCat?.name}</MenuItem>
                              )
                            })
                          )
                        })
                      )
                    })
                  }
                </Select>
              }

            </div>


            <div className='col'>
              <h3 className='text-[14px] font-[500] !mb-1 !text-black'>Price</h3>
              <input
                type="number"
                className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] !focus:outline-none !focus:border-[rgba(0,0,0,0.4)] !rounded-sm !p-3 !text-sm !bg-[#fff]'
                name="price"
                value={formFields.price}
                onChange={onChangeInput} />
            </div>

            <div className='col'>
              <h3 className='text-[14px] font-[500] !mb-1 '>Product Old Price</h3>
              <input
                type="number"
                className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] !focus:outline-none !focus:border-[rgba(0,0,0,0.4)] !rounded-sm !p-3 !text-sm !bg-[#fff]'
                name="oldPrice"
                value={formFields.oldPrice}
                onChange={onChangeInput} />
            </div>

            <div className='col'>
              <h3 className='text-[14px] font-[500] !mb-1'>Is Featured?</h3>
              <Select
                labelId="demo-simple-select-label"
                id="productCatDrop"
                size='small'
                className='w-full !bg-[#fafafa]'
                value={productFeatured}
                label="Category"
                onChange={handleChangeProductFeatured}
              >
                <MenuItem value={true}>True</MenuItem>
                <MenuItem value={false}>False</MenuItem>
              </Select>
            </div>

            <div className='col'>
              <h3 className='text-[14px] font-[500] !mb-1 !text-black'>Product Stock</h3>
              <input
                type="number"
                className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] !focus:outline-none !focus:border-[rgba(0,0,0,0.4)] !rounded-sm !p-3 !text-sm !bg-[#fff]'
                name="countInStock"
                value={formFields.countInStock}
                onChange={onChangeInput}
              />
            </div>

            <div className='col'>
              <h3 className='text-[14px] font-[500] !mb-1 !text-black'>Brand</h3>
              <input
                type="text"
                className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] !focus:outline-none !focus:border-[rgba(0,0,0,0.4)] !rounded-sm !p-3 !text-sm !bg-[#fff]'
                name="brand"
                value={formFields.brand}
                onChange={onChangeInput} />
            </div>


            <div className='col'>
              <h3 className='text-[14px] font-[500] !mb-1 !text-black'>Discount</h3>
              <input
                type="number"
                className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] !focus:outline-none !focus:border-[rgba(0,0,0,0.4)] !rounded-sm !p-3 !text-sm !bg-[#fff]'
                name="discount"
                value={formFields.discount}
                onChange={onChangeInput} />
            </div>

            <div className='col'>
              <h3 className='text-[14px] font-[500] !mb-1'>Product RAMS</h3>
              {
                productRamsData?.length !== 0 &&
                <Select
                  multiple
                  labelId="demo-simple-select-label"
                  id="productCatDrop"
                  size='small'
                  className='w-full !bg-[#fafafa]'
                  value={productRams}
                  label="Category"
                  onChange={handleChangeProductRams}
                >
                  {
                    productRamsData?.map((item, index) => {
                      return <MenuItem key={index} value={item?.name}>{item.name}</MenuItem>
                    })
                  }
                </Select>
              }

            </div>



            <div className='col'>
              <h3 className='text-[14px] font-[500] !mb-1'>Product Weight</h3>
              {
                productWeightData?.length !== 0 &&
                <Select
                  multiple
                  labelId="demo-simple-select-label"
                  id="productSubCatDrop"
                  size='small'
                  className='w-full !bg-[#fafafa]'
                  value={productWeight}
                  label="Category"
                  onChange={handleChangeProductWeight}
                >
                  {
                    productWeightData?.map((item, index) => {
                      return <MenuItem key={index} value={item?.name}>{item?.name}</MenuItem>

                    })
                  }
                </Select>
              }

            </div>


            <div className='col'>
              <h3 className='text-[14px] font-[500] !mb-1'>Product Size</h3>
              {
                productWeightData?.length !== 0 &&
                <Select
                  multiple
                  labelId="demo-simple-select-label"
                  id="productSubCatDrop"
                  size='small'
                  className='w-full !bg-[#fafafa]'
                  value={productSize}
                  label="Category"
                  onChange={handleChangeProductSize}
                >
                  {
                    productSizeData?.map((item, index) => {
                      return <MenuItem key={index} value={item?.name}>{item?.name}</MenuItem>

                    })
                  }
                </Select>
              }

            </div>
          </div>

          <div className='grid grid-cols-4 !mb-3 gap-4'>


            <div className='col'>
              <h3 className='text-[14px] font-[500] !mb-1 '>Product Rating</h3>
              <Rating
                name="half-rating"
                defaultValue={1}
                precision={0.5}
                onChange={onChangeRating}
              />
            </div>
          </div>



          <div className='col w-full !p-5 !px-0'>
            <h3 className='text-[18px] font-[700] !mb-4'>Media & Images</h3>


            <div className='grid grid-cols-7 gap-4'>

              {
                previews.length !== 0 && previews?.map((image, index) => {
                  return (
                    <div key={index} className='uploadBoxWrapper relative'>
                      <span className='absolute w-[20px] h-[20px] !rounded-full !overflow-hidden !bg-red-500 -top-[5px] -right-[5px] flex items-center justify-center z-50 cursor-pointer'
                        onClick={() => removeImg(image, index)}>
                        <IoMdClose className='text-white text-[17px]' />
                      </span>
                      <div className='uploadBox !p-0 !rounded-md !overflow-hidden !border  !border-dashed !border-[rgba(0,0,0,0.3)] h-[150px] w-[100%] !bg-gray-100 cursor-pointer hover:!bg-gray-200 flex items-center justify-center flex-col relative'>
                        <img src={image} className='w-100' />
                      </div>
                    </div>
                  )
                })
              }



              <UploadBox multiple={true} url="/api/product/uploadImages" setPreviewsFun={setPreviewsFun} />

            </div>

          </div>

        </div>
        <div className='sticky bottom-0 !bg-gray-100 left-0 right-0  !p-5 !border-t !border-gray-300 z-50'>
          <Button type='submit' className='btn-blue btn-lg w-full flex gap-4'>
            {
              isLoading === true ? <CircularProgress color="inherit" />
                :
                <>
                  <GrCloudUpload className='text-[25px] text-white' />
                  Publish and View
                </>
            }

          </Button>
        </div>
      </form>
    </section>
  )
}

export default AddProduct