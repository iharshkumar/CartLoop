import React, { useContext, useEffect, useState } from 'react';
import "../ProductItem/style.css";
import { Link } from 'react-router-dom';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import { FaMinus, FaPlus, FaRegHeart } from 'react-icons/fa';
import { IoGitCompareOutline } from 'react-icons/io5';
import { MdZoomOutMap } from 'react-icons/md';
import { FaShoppingCart } from 'react-icons/fa';
import { MyContext } from '../../App';
import { deleteData, editData, postData } from '../../utils/api.js';
import CircularProgress from '@mui/material/CircularProgress';
import { IoMdClose, IoMdHeart } from 'react-icons/io';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const ProductItemListView = (props) => {

    const [quantity, setQuantity] = useState(1);
    const [isAdded, setIsAdded] = useState(false);
    const [cartItem, setCartItem] = useState([])
    const context = useContext(MyContext);
    const [isLoading, setIsLoading] = useState(false);
    const [activeSize, setActiveSize] = useState(null);
    const [activeRam, setActiveRam] = useState(null);
    const [activeWeight, setActiveWeight] = useState(null);
    const [tabType, setTabType] = useState('size');
    const [isShowTabs, setIsShowTabs] = useState(false);
    const [isAddedToMyList, setIsAddedToMyList] = useState(false);

    const addToCart = async (product, userId, quantity) => {
        setIsLoading(true);
        if (props?.item?.size?.length !== 0 && activeSize === null) {
            setTabType('size');
            setIsShowTabs(true);
            setTimeout(() => setIsLoading(false), 500);
            return false;
        }
        if (props?.item?.productRam?.length !== 0 && activeRam === null) {
            setTabType('ram');
            setIsShowTabs(true);
            setTimeout(() => setIsLoading(false), 500);
            return false;
        }
        if (props?.item?.productWeight?.length !== 0 && activeWeight === null) {
            setTabType('weight');
            setIsShowTabs(true);
            setTimeout(() => setIsLoading(false), 500);
            return false;
        }
        const variations = {
            productSize: activeSize !== null ? props?.item?.size[activeSize] : "",
            productRam: activeRam !== null ? props?.item?.productRam[activeRam] : "",
            productWeight: activeWeight !== null ? props?.item?.productWeight[activeWeight] : ""
        }
        context?.addToCart(product, userId, quantity, variations);
        setIsAdded(true);
        setIsShowTabs(false);
        setTimeout(() => setIsLoading(false), 500);
    }

    const handleActiveTab = (index) => {
        if (tabType === 'size') setActiveSize(index);
        else if (tabType === 'ram') setActiveRam(index);
        else if (tabType === 'weight') setActiveWeight(index);

        if (tabType === 'size') {
            if (props?.item?.productRam?.length !== 0) setTabType('ram');
            else if (props?.item?.productWeight?.length !== 0) setTabType('weight');
            else setIsShowTabs(false);
        } else if (tabType === 'ram') {
            if (props?.item?.productWeight?.length !== 0) setTabType('weight');
            else setIsShowTabs(false);
        } else {
            setIsShowTabs(false);
        }
    }

    useEffect(() => {
        const item = context?.cartData?.filter((cartItem) =>
            cartItem.productId.includes(props?.item?._id)
        )
        const myListItem = context?.myListData?.filter((item) =>
            item?.productId.includes(props?.item?._id)
        )
        if (item.length !== 0) {
            setIsAdded(true);
            setCartItem(item);
            setQuantity(item[0].quantity);
        } else {
            setIsAdded(false);
            setQuantity(1);
        }
        if (myListItem.length !== 0) setIsAddedToMyList(true);
        else setIsAddedToMyList(false);
    }, [context?.cartData, context?.myListData])

    const updateCartQty = (id, quantity) => {
        const obj = {
            _id: id,
            quantity: parseInt(quantity),
            subTotal: parseInt(Number(props?.item?.price) * quantity)
        }
        editData(`/api/cart/update`, obj).then((res) => {
            if (res?.error === false) {
                context.alertBox("success", res?.message);
                context.getCartItems();
            }
        })
    }

    const addQty = () => {
        if (quantity < props?.item?.countInStock) {
            const newQty = quantity + 1;
            setQuantity(newQty);
            updateCartQty(cartItem[0]?._id, newQty);
        } else {
            context.alertBox("error", "Stock limit reached");
        }
    }

    const subQty = () => {
        if (quantity > 1) {
            const newQty = quantity - 1;
            setQuantity(newQty);
            updateCartQty(cartItem[0]?._id, newQty);
        } else {
            deleteData(`/api/cart/delete-cart-item/${cartItem[0]?._id}`).then((res) => {
                if (res?.error === false) {
                    setIsAdded(false);
                    context.alertBox("success", res?.message);
                    context.getCartItems();
                }
            })
        }
    }

    const handleAddToMyList = (item) => {
        if (context?.userData?._id === null || context?.userData?._id === undefined) {
            context?.alertBox("error", "Please login to add product to my Wishlist");
            return false;
        }
        if (isAddedToMyList === true) {
            const myListItem = context?.myListData?.find((listItem) => listItem.productId === item?._id);
            if (myListItem) {
                deleteData(`/api/myList/${myListItem?._id}`).then((res) => {
                    if (res?.error === false) {
                        context?.alertBox("success", "Item Removed from Wishlist");
                        setIsAddedToMyList(false);
                        context?.getMyListData();
                    }
                })
            }
        } else {
            const obj = {
                productId: item?._id,
                userId: context?.userData?._id,
                productTitle: item?.name,
                image: item?.images[0],
                price: item?.price,
                oldPrice: item?.oldPrice,
                discount: item?.discount,
                rating: item?.rating,
                brand: item?.brand,
            }
            postData("/api/myList/add", obj).then((res) => {
                if (res?.error === false) {
                    context?.alertBox("success", "Item Added to Wishlist");
                    setIsAddedToMyList(true);
                    context?.getMyListData();
                } else {
                    context?.alertBox("error", res?.message);
                }
            })
        }
    }

    return (
        <>
            {/* DESKTOP VIEW */}
            <div className='hidden md:flex productItem bg-white border border-gray-200 rounded-lg !p-4 !mb-4 gap-4' style={{ flexDirection: 'row', height: '250px' }}>
                <div className="productItem__imageWrapper flex-shrink-0" style={{ width: '200px', borderRadius: '12px', aspectRatio: '3/4' }}>
                    <Link to={`/product/${props?.item?._id}`} className="productItem__imageLink">
                        <div className='productItem__imageContainer' style={{ width: '100%', height: '100%' }}>
                            <img
                                src={props?.item?.images?.[0]}
                                alt={props?.item?.name}
                                className='productItem__image productItem__image--primary'
                                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                            />
                            <img
                                src={props?.item?.images?.[1] || props?.item?.images?.[0]}
                                alt={props?.item?.name}
                                className='productItem__image productItem__image--secondary'
                                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                            />
                        </div>
                    </Link>

                    {isShowTabs === true &&
                        <div className='flex items-center justify-center absolute top-0 left-0 w-full h-full !bg-[rgba(0,0,0,0.7)] !z-60 !p-3 gap-2 flex-col'>
                            <Button className='!absolute !top-[13px] !right-[14px] cursor-pointer !min-w-[35px] !min-h-[35px] !w-[35px] !rounded-full !bg-[rgba(255,255,255,1)]'
                                onClick={() => setIsShowTabs(false)}>
                                <IoMdClose className='!text-black !z-[90] cursor-pointer text-[25px]' />
                            </Button>
                            <h4 className='text-white text-[14px] font-[500]'>Select {tabType.toUpperCase()}</h4>
                            <div className='flex items-center justify-center gap-2 flex-wrap'>
                                {tabType === 'size' && props?.item?.size?.length !== 0 && props?.item?.size?.map((size, index) => (
                                    <span key={index} className={`flex items-center justify-center !p-1 !px-2 !bg-[rgba(255,255,255,0.8)] !max-w-[35px] !h-[25px] rounded-sm cursor-pointer hover:bg-white ${activeSize === index && '!bg-red-500 !text-white'}`}
                                        onClick={() => handleActiveTab(index)}>{size}</span>
                                ))}
                                {tabType === 'ram' && props?.item?.productRam?.length !== 0 && props?.item?.productRam?.map((ram, index) => (
                                    <span key={index} className={`flex items-center justify-center !p-1 !px-2 !bg-[rgba(255,255,255,0.8)] !max-w-[45px] !h-[25px] rounded-sm cursor-pointer hover:bg-white ${activeRam === index && '!bg-red-500 !text-white'}`}
                                        onClick={() => handleActiveTab(index)}>{ram}</span>
                                ))}
                                {tabType === 'weight' && props?.item?.productWeight?.length !== 0 && props?.item?.productWeight?.map((weight, index) => (
                                    <span key={index} className={`flex items-center justify-center !p-1 !px-2 !bg-[rgba(255,255,255,0.8)] !max-w-[55px] !h-[25px] rounded-sm cursor-pointer hover:bg-white ${activeWeight === index && '!bg-red-500 !text-white'}`}
                                        onClick={() => handleActiveTab(index)}>{weight}</span>
                                ))}
                            </div>
                        </div>
                    }

                    <span className="productItem__discount">{props?.item?.discount}%</span>
                    <div className='productItem__actions'>
                        <Button className='productItem__actionBtn' title="Quick View" onClick={() => context.handleOpenProductDetailsModal(true, props.item)}>
                            <MdZoomOutMap />
                        </Button>
                        <Button className='productItem__actionBtn' title="Compare" onClick={() => context.addToCompare(props?.item)}>
                            <IoGitCompareOutline />
                        </Button>
                        <Button className='productItem__actionBtn' title="Add to Wishlist" onClick={() => handleAddToMyList(props?.item)}>
                            {isAddedToMyList === true ? <IoMdHeart className='!text-red-500' /> : <FaRegHeart />}
                        </Button>
                    </div>
                </div>

                <div className='productItem__info flex flex-col justify-between !mt-0 !mb-0'>
                    <div>
                        <h6 className='productItem__category'>
                            <Link to={`/products?catId=${props?.item?.catId}`} className='productItem__link'>
                                {props?.item?.brand}
                            </Link>
                        </h6>
                        <h3 className='productItem__title'>
                            <Link to={`/product/${props?.item?._id}`} className='productItem__link'>
                                {props?.item?.name}
                            </Link>
                        </h3>
                        <p className='text-sm text-gray-600 !mb-0 !mt-0 leading-relaxed'>
                            {props?.item?.description?.slice(0, 120)}{props?.item?.description?.length > 120 ? '...' : ''}
                        </p>
                        <div className='productItem__rating !mt-0'>
                            <Rating name="size-small" defaultValue={props?.item?.rating || 0} size="small" readOnly />
                        </div>
                    </div>
                    <div className='flex items-center justify-between !mt-0'>
                        <div className='productItem__priceWrapper'>
                            <span className='productItem__oldPrice'>&#8377; {props?.item?.oldPrice}</span>
                            <span className='productItem__price'>&#8377; {props?.item?.price}</span>
                        </div>
                        {isAdded === false ? (
                            <Button className='btn-org btn-border text-red !px-6 !py-2 hover:!text-white rounded-full flex items-center gap-2'
                                title="Add to Cart" onClick={() => addToCart(props?.item, context?.userData?._id, quantity)}>
                                <FaShoppingCart />
                                <span className='text-sm'>Add to Cart</span>
                            </Button>
                        ) : (
                            <>
                                {isLoading === true ?
                                    <Button className='btn-org btn-border text-red !px-6 !py-2 hover:!text-white rounded-full flex items-center gap-2'>
                                        <CircularProgress size={20} />
                                    </Button>
                                    :
                                    <div className='flex items-center !w-[100px] justify-between overflow-hidden !rounded-full !border !border-[rgba(0,0,0,0.1)]'>
                                        <Button className='!min-w-[35px] !w-[35px] !h-[30px] !bg-[#f1f1f1] !rounded-none' onClick={subQty}>
                                            <FaMinus className="!text-[rgba(0,0,0,0.7)]" />
                                        </Button>
                                        <span>{quantity}</span>
                                        <Button className='!min-w-[35px] !w-[35px] !h-[30px] !bg-red-500 !rounded-none' onClick={addQty}>
                                            <FaPlus className="!text-white" />
                                        </Button>
                                    </div>
                                }
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className='md:hidden !mb-3' style={{ height: '150px' }}>
                <Swiper
                    slidesPerView={1}
                    speed={350}
                    resistance={true}
                    resistanceRatio={0.2}
                    className='w-full h-full rounded-xl overflow-hidden shadow-sm border border-gray-100'
                >
                    <SwiperSlide className='!h-full'>
                        <div className='flex flex-row h-full bg-white'>
                            <Link to={`/product/${props?.item?._id}`} className='flex-shrink-0 w-[100px] h-full block overflow-hidden bg-gray-50'>
                                <img
                                    src={props?.item?.images?.[0]}
                                    alt={props?.item?.name}
                                    className='w-full h-full object-cover object-top'
                                />
                            </Link>

                            <div className='flex flex-col justify-between flex-1 !px-3 !py-2.5 overflow-hidden'>
                                <div>
                                    <span className='text-[9px] uppercase font-bold text-gray-400 tracking-widest'>
                                        {props?.item?.brand}
                                    </span>
                                    <h3 className='text-[13px] font-bold text-gray-800 line-clamp-2 leading-snug !mt-0.5 !mb-1'>
                                        {props?.item?.name}
                                    </h3>
                                    <div className='flex items-center gap-2'>
                                        <Rating value={props?.item?.rating || 0} size="small" readOnly sx={{ fontSize: '11px' }} />
                                    </div>
                                    <div className='flex items-center gap-2 !mt-1'>
                                        <span className='text-[11px] text-gray-400 line-through'>&#8377;{props?.item?.oldPrice}</span>
                                        <span className='text-[15px] font-black text-red-600'>&#8377;{props?.item?.price}</span>
                                    </div>
                                </div>

                                {/* Action buttons */}
                                <div className='flex items-center gap-2'>
                                    {isAdded === false ? (
                                        <Button
                                            className='!flex-1 !h-[32px] !min-h-0 !bg-red-500 !text-white !rounded-full !text-[11px] !font-bold !normal-case flex items-center justify-center gap-1.5'
                                            onClick={() => addToCart(props?.item, context?.userData?._id, quantity)}
                                        >
                                            {isLoading
                                                ? <CircularProgress size={13} color="inherit" />
                                                : <FaShoppingCart className='text-[11px]' />
                                            }
                                            Add to Cart
                                        </Button>
                                    ) : (
                                        <div className='flex items-center flex-1 justify-between overflow-hidden rounded-full border border-gray-200 h-[32px]'>
                                            <Button className='!min-w-[32px] !w-[32px] !h-full !p-0 !rounded-none !bg-gray-100' onClick={subQty}>
                                                <FaMinus className='text-[10px] text-gray-600' />
                                            </Button>
                                            <span className='text-[13px] font-bold text-gray-800'>{quantity}</span>
                                            <Button className='!min-w-[32px] !w-[32px] !h-full !p-0 !rounded-none !bg-red-500 !text-white' onClick={addQty}>
                                                <FaPlus className='text-[10px]' />
                                            </Button>
                                        </div>
                                    )}
                                    <Button
                                        className='!w-[32px] !h-[32px] !min-w-0 !p-0 !rounded-full !bg-gray-100 flex-shrink-0'
                                        onClick={() => handleAddToMyList(props?.item)}
                                    >
                                        {isAddedToMyList
                                            ? <IoMdHeart className='text-red-500 text-[15px]' />
                                            : <FaRegHeart className='text-gray-600 text-[14px]' />
                                        }
                                    </Button>
                                    <Button
                                        className='!w-[32px] !h-[32px] !min-w-0 !p-0 !rounded-full !bg-gray-800 !text-white flex-shrink-0'
                                        onClick={() => context.handleOpenProductDetailsModal(true, props.item)}
                                    >
                                        <MdZoomOutMap className='text-[15px]' />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                </Swiper>
            </div>
        </>
    )
}

export default ProductItemListView;