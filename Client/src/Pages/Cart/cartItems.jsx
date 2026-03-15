import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { IoCloseSharp } from "react-icons/io5";
import Rating from '@mui/material/Rating';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { GoTriangleDown } from "react-icons/go";
import { MyContext } from '../../App';
import { deleteData } from '../../utils/api';

const CartItems = (props) => {
    const context = useContext(MyContext);

    const [sizeanchorEl, setsizeAnchorEl] = useState(null);
    const openSize = Boolean(sizeanchorEl);

    const [qtyanchorEl, setQtyAnchorEl] = useState(null);
    const openQty = Boolean(qtyanchorEl);

    const [ramanchorEl, setRamAnchorEl] = useState(null);
    const openRam = Boolean(ramanchorEl);

    const [weightanchorEl, setWeightAnchorEl] = useState(null);
    const openWeight = Boolean(weightanchorEl);


    const handleClickSize = (event) => {
        setsizeAnchorEl(event.currentTarget);
    };
    const handleCloseSize = (value) => {
        setsizeAnchorEl(null);
        if (value !== null) {
            context.updateCartItem(props.item._id, { size: value });
        }
    };

    const handleClickQty = (event) => {
        setQtyAnchorEl(event.currentTarget);
    };

    const handleCloseQty = (value) => {
        setQtyAnchorEl(null);
        if (value !== null) {
            const qty = parseInt(value);
            const subTotal = props.item.price * qty;
            context.updateCartItem(props.item._id, { quantity: qty, subTotal: subTotal });
        }
    };

    const handleClickRam = (event) => {
        setRamAnchorEl(event.currentTarget);
    };
    const handleCloseRam = (value) => {
        setRamAnchorEl(null);
        if (value !== null) {
            context.updateCartItem(props.item._id, { ram: value });
        }
    };

    const handleClickWeight = (event) => {
        setWeightAnchorEl(event.currentTarget);
    };
    const handleCloseWeight = (value) => {
        setWeightAnchorEl(null);
        if (value !== null) {
            context.updateCartItem(props.item._id, { weight: value });
        }
    };

    const handleDeleteCart = () => {
        deleteData(`/api/cart/delete-cart-item/${props?.item?._id}`).then((res) => {
            context?.alertBox("success", "Item removed from cart");
            context?.getCartItems();
        })
    }

    return (
        <div className='cartItem w-full !p-3 flex items-center gap-4 !pb-5 !border-b !border-[rgba(0,0,0.1)]'>
            <div className='img w-[15%] !rounded-md !overflow-hidden'>
                <Link to={`/product/${props?.item?.productId}`} className="group">
                    <img src={props?.item?.image}
                        className='w-full group-hover:scale-105 transition-all' />
                </Link>
            </div>


            <div className='info w-[85%] relative '>

                <IoCloseSharp className='cursor-pointer absolute  top-[0px] right-[0px] text-[22px] link transition-all' onClick={handleDeleteCart} />
                <span className='text-[14px]'>{props?.item?.brand}</span>
                <h3 className='text-[15px]'>
                    <Link className='link' to={`/product/${props?.item?.productId}`}>{props?.item?.productTitle}
                    </Link>
                </h3>

                <Rating name="size-small" value={props?.item?.rating} size="small" readOnly />

                <div className='flex items-center gap-4 !mt-2 flex-wrap'>
                    <div className='relative'>
                        {props?.item?.productSizes?.length > 0 && (
                            <>
                                <span className='flex items-center justify-center bg-[#f1f1f1] text-[12px] font-[600] !py-1 !px-2 !rounded-md cursor-pointer' onClick={handleClickSize}>
                                    Size: {props?.item?.size}<GoTriangleDown />
                                </span>

                                <Menu
                                    id="size-menu"
                                    anchorEl={sizeanchorEl}
                                    open={openSize}
                                    onClose={() => handleCloseSize(null)}
                                    slotProps={{
                                        list: {
                                            'aria-labelledby': 'basic-button',
                                        },
                                    }}
                                >
                                    {props?.item?.productSizes?.map((size, index) => (
                                        <MenuItem key={index} onClick={() => handleCloseSize(size)}>{size}</MenuItem>
                                    ))}
                                </Menu>
                            </>
                        )}
                    </div>

                    <div className='relative'>
                        {props?.item?.productRams?.length > 0 && (
                            <>
                                <span className='flex items-center justify-center bg-[#f1f1f1] text-[12px] font-[600] !py-1 !px-2 !rounded-md cursor-pointer' onClick={handleClickRam}>
                                    RAM: {props?.item?.ram}<GoTriangleDown />
                                </span>

                                <Menu
                                    id="ram-menu"
                                    anchorEl={ramanchorEl}
                                    open={openRam}
                                    onClose={() => handleCloseRam(null)}
                                    slotProps={{
                                        list: {
                                            'aria-labelledby': 'basic-button',
                                        },
                                    }}
                                >
                                    {props?.item?.productRams?.map((ram, index) => (
                                        <MenuItem key={index} onClick={() => handleCloseRam(ram)}>{ram}</MenuItem>
                                    ))}
                                </Menu>
                            </>
                        )}
                    </div>

                    <div className='relative'>
                        {props?.item?.productWeights?.length > 0 && (
                            <>
                                <span className='flex items-center justify-center bg-[#f1f1f1] text-[12px] font-[600] !py-1 !px-2 !rounded-md cursor-pointer' onClick={handleClickWeight}>
                                    Weight: {props?.item?.weight}<GoTriangleDown />
                                </span>

                                <Menu
                                    id="weight-menu"
                                    anchorEl={weightanchorEl}
                                    open={openWeight}
                                    onClose={() => handleCloseWeight(null)}
                                    slotProps={{
                                        list: {
                                            'aria-labelledby': 'basic-button',
                                        },
                                    }}
                                >
                                    {props?.item?.productWeights?.map((weight, index) => (
                                        <MenuItem key={index} onClick={() => handleCloseWeight(weight)}>{weight}</MenuItem>
                                    ))}
                                </Menu>
                            </>
                        )}
                    </div>

                    <div className='relative'>
                        <span className='flex items-center justify-center bg-[#f1f1f1] text-[12px] font-[600] !py-1 !px-2 !rounded-md cursor-pointer' onClick={handleClickQty}>
                            Qty: {props?.item?.quantity}<GoTriangleDown />
                        </span>

                        <Menu
                            id="qty-menu"
                            anchorEl={qtyanchorEl}
                            open={openQty}
                            onClose={() => handleCloseQty(null)}
                            slotProps={{
                                list: {
                                    'aria-labelledby': 'basic-button',
                                },
                            }}
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((qty) => (
                                <MenuItem key={qty} onClick={() => handleCloseQty(qty)}>{qty}</MenuItem>
                            ))}
                        </Menu>
                    </div>
                </div>


                <div className='flex items-center gap-4 !mt-3'>

                    <span className='price text-[15px] font-[600] text-red-500'>
                        {props?.item?.discount}%
                    </span>

                    <span className='price text-[15px] font-[600]'>
                        Price: &#8377; {props?.item?.price}
                    </span>



                    <span className='price text-[#f15252] text-[15px] font-[700]'>
                        Subtotal: &#8377; {props?.item?.subTotal?.toLocaleString("en-IN")}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default CartItems