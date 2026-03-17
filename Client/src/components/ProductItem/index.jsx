import React, { useContext } from 'react';
import "../ProductItem/style.css";
import { Link } from 'react-router-dom';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import { FaMinus, FaPlus, FaRegHeart, FaShoppingCart } from 'react-icons/fa';
import { IoGitCompareOutline } from 'react-icons/io5';
import { MdZoomOutMap } from 'react-icons/md';
import { MyContext } from '../../App';
import { InsertEmoticonSharp } from '@mui/icons-material';
import { useState } from 'react';
import { useEffect } from 'react';
import { deleteData, editData, postData } from '../../utils/api.js';
import CircularProgress from '@mui/material/CircularProgress';
import { IoMdClose } from "react-icons/io";

const ProductItem = (props) => {
    const [quantity, setQuantity] = useState(1);
    const [isAdded, setIsAdded] = useState(false);
    const [cartItem, setCartItem] = useState([])
    const context = useContext(MyContext);
    const [isLoading, setIsLoading] = useState(false);
    const [activeSize, setActiveSize] = useState(null);
    const [activeRam, setActiveRam] = useState(null);
    const [activeWeight, setActiveWeight] = useState(null);
    const [tabType, setTabType] = useState('size'); // 'size', 'ram', 'weight'
    const [isShowTabs, setIsShowTabs] = useState(false);

    const addToCart = async (product, userId, quantity) => {

        setIsLoading(true);
        if (props?.item?.size?.length !== 0 && activeSize === null) {
            setTabType('size');
            setIsShowTabs(true);
            setTimeout(() => {
                setIsLoading(false);
            }, 500);
            return false;
        }

        if (props?.item?.productRam?.length !== 0 && activeRam === null) {
            setTabType('ram');
            setIsShowTabs(true);
            setTimeout(() => {
                setIsLoading(false);
            }, 500);
            return false;
        }

        if (props?.item?.productWeight?.length !== 0 && activeWeight === null) {
            setTabType('weight');
            setIsShowTabs(true);
            setTimeout(() => {
                setIsLoading(false);
            }, 500);
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
        setTimeout(() => {
            setIsLoading(false);
        }, 500);
    }

    const handleActiveTab = (index) => {
        if (tabType === 'size') {
            setActiveSize(index);
        } else if (tabType === 'ram') {
            setActiveRam(index);
        } else if (tabType === 'weight') {
            setActiveWeight(index);
        }

        if (tabType === 'size') {
            if (props?.item?.productRam?.length !== 0) {
                setTabType('ram');
            } else if (props?.item?.productWeight?.length !== 0) {
                setTabType('weight');
            } else {
                setIsShowTabs(false);
            }
        } else if (tabType === 'ram') {
            if (props?.item?.productWeight?.length !== 0) {
                setTabType('weight');
            } else {
                setIsShowTabs(false);
            }
        } else {
            setIsShowTabs(false);
        }
    }

    useEffect(() => {
        const item = context?.cartData?.filter((cartItem) =>
            cartItem.productId.includes(props?.item?._id)
        )

        if (item.length !== 0) {
            setIsAdded(true)
            setCartItem(item)
            setQuantity(item[0].quantity)
        } else {
            setIsAdded(false)
            setQuantity(1)
        }
    }, [context?.cartData])

    const updateCartQty = (id, qty) => {
        const obj = {
            _id: id,
            qty: qty,
            subTotal: parseInt(Number(props?.item?.price) * qty)
        }
        editData(`/api/cart/update-qty`, obj).then((res) => {
            if (res?.error === false) {
                context.alertBox("success", res?.message)
                context.getCartItems()
            }
        })
    }

    const addQty = () => {
        if (quantity < props?.item?.countInStock) {
            const newQty = quantity + 1;
            setQuantity(newQty)
            updateCartQty(cartItem[0]?._id, newQty)
        } else {
            context.alertBox("error", "Stock limit reached")
        }
    }

    const subQty = () => {
        if (quantity > 1) {
            const newQty = quantity - 1;
            setQuantity(newQty)
            updateCartQty(cartItem[0]?._id, newQty)
        }
        else {
            deleteData(`/api/cart/delete-cart-item/${cartItem[0]?._id}`).then((res) => {
                if (res?.error === false) {
                    setIsAdded(false);
                    context.alertBox("success", res?.message)
                    context.getCartItems();
                }
            })
        }
    }

    return (
        <div className='productItem '>
            <div className="productItem__imageWrapper">
                <Link to={`/product/${props?.item?._id}`} className="productItem__imageLink">
                    <div className='productItem__imageContainer'>
                        <img
                            src={props?.item?.images[0]}
                            alt="Product"
                            className='productItem__image productItem__image--primary'
                        />
                        <img
                            src={props?.item?.images[1]}
                            alt="Product alternate view"
                            className='!w-full productItem__image productItem__image--secondary'
                        />
                    </div>
                </Link>

                {
                    isShowTabs === true &&
                    <div className='flex items-center justify-center absolute top-0 left-0 w-full h-full !bg-[rgba(0,0,0,0.7)] !z-60 !p-3 gap-2 flex-col'>

                        <Button className='!absolute !top-[13px] !right-[14px] cursor-pointer !min-w-[35px] !min-h-[35px] !w-[35px] !rounded-full !bg-[rgba(255,255,255,1)]'
                            onClick={() => setIsShowTabs(false)}>
                            <IoMdClose className=' !text-black !z-[90]  cursor-pointer text-[25px]' />
                        </Button>

                        <h4 className='text-white text-[14px] font-[500]'>Select {tabType.toUpperCase()}</h4>
                        <div className='flex items-center justify-center gap-2 flex-wrap'>
                            {
                                tabType === 'size' && props?.item?.size?.length !== 0 && props?.item?.size?.map((size, index) => {
                                    return (
                                        <span key={index} className={`flex items-center justify-center !p-1 !px-2 !bg-[rgba(255,255,255,0.8)] !max-w-[35px] !h-[25px] rounded-sm cursor-pointer hover:bg-white ${activeSize === index && '!bg-red-500 !text-white'}`}
                                            onClick={() => handleActiveTab(index)}
                                        >
                                            {size}
                                        </span>
                                    )
                                })
                            }

                            {
                                tabType === 'ram' && props?.item?.productRam?.length !== 0 && props?.item?.productRam?.map((ram, index) => {
                                    return (
                                        <span key={index} className={`flex items-center justify-center !p-1 !px-2 !bg-[rgba(255,255,255,0.8)] !max-w-[45px] !h-[25px] rounded-sm cursor-pointer hover:bg-white ${activeRam === index && '!bg-red-500 !text-white'}`}
                                            onClick={() => handleActiveTab(index)}
                                        >
                                            {ram}
                                        </span>
                                    )
                                })
                            }

                            {
                                tabType === 'weight' && props?.item?.productWeight?.length !== 0 && props?.item?.productWeight?.map((weight, index) => {
                                    return (
                                        <span key={index} className={`flex items-center justify-center !p-1 !px-2 !bg-[rgba(255,255,255,0.8)] !max-w-[55px] !h-[25px] rounded-sm cursor-pointer hover:bg-white ${activeWeight === index && '!bg-red-500 !text-white'}`}
                                            onClick={() => handleActiveTab(index)}
                                        >
                                            {weight}
                                        </span>
                                    )
                                })
                            }
                        </div>
                    </div>
                }

                <span className="productItem__discount">
                    {props?.item?.discount}%
                </span>
                <div className='productItem__actions'>
                    <Button className='productItem__actionBtn' title="Quick View" onClick={() => context.handleOpenProductDetailsModal(true, props?.item)}>
                        <MdZoomOutMap />
                    </Button>
                    <Button className='productItem__actionBtn' title="Compare">
                        <IoGitCompareOutline />
                    </Button>
                    <Button className='productItem__actionBtn' title="Add to Wishlist">
                        <FaRegHeart />
                    </Button>
                </div>
            </div>
            <div className='productItem__info'>
                <h6 className='productItem__category !font-[400]'>
                    <span className='productItem__link'>
                        {props?.item?.brand}
                    </span>
                </h6>
                <h3 className='productItem__title'>
                    <Link to={`/product/${props?.item?._id}`} className='productItem__link'>
                        {props?.item?.name}
                    </Link>
                </h3>
                <div className='productItem__rating'>
                    <Rating name="size-small" defaultValue={props?.item?.rating} precision={0.5} size="small" readOnly />
                </div>
                <div className='productItem__priceWrapper'>
                    <span className='productItem__oldPrice'>
                        &#8377; {props?.item?.oldPrice}
                    </span>
                    <span className='productItem__price'>
                        &#8377; {props?.item?.price}
                    </span>
                </div>


                {
                    isAdded === false ? (
                        <Button
                            className='btn-org btn-border !text-red !px-6 !py-2 btn-sm hover:!text-white rounded-full flex items-center gap-2 !mt-2 !w-full'
                            title="Add to Cart"
                            onClick={() => addToCart(props?.item, context?.userData?._id, quantity)}
                        >
                            <FaShoppingCart className='text-sm' />
                            <span className='text-[12px]'>Add to Cart</span>
                        </Button>
                    )
                        :
                        <>
                            {
                                isLoading === true ?
                                    <Button
                                        className='btn-org btn-border !text-red !px-6 !py-2 btn-sm hover:!text-white rounded-full flex items-center gap-2 !mt-2 !w-full'                                   >
                                        <CircularProgress />
                                    </Button>
                                    :
                                    <div className='flex items-center justify-between overflow-hidden !rounded-full !border !border-[rgba(0,0,0,0.1)]'>
                                        <Button className='!min-w-[35px] !w-[35px] !h-[30px] !bg-[#f1f1f1] !rounded-none '
                                            onClick={subQty}
                                        >
                                            <FaMinus className="!text-[rgba(0,0,0,0.7)]" />
                                        </Button>
                                        <span>{quantity}</span>
                                        <Button className='!min-w-[35px] !w-[35px] !h-[30px] !bg-red-500 !rounded-none '
                                            onClick={addQty}
                                        >
                                            <FaPlus className="!text-white" />
                                        </Button>
                                    </div>

                            }
                        </>

                }



            </div>
        </div>

    )
}

export default ProductItem;