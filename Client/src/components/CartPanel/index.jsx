import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { MdOutlineDelete } from "react-icons/md";
import Button from '@mui/material/Button';
import { MyContext } from "../../App";
import { deleteData } from '../../utils/api.js';

const CartPanel = (props) => {

    const context = useContext(MyContext);
    const removeItem = (id) => {
        deleteData(`/api/cart/delete-cart-item/${id}`).then((res) => {
            context?.alertBox("success", "Item removed from cart");
            context?.getCartItems();
        })
    }
    return (
        <div className="flex flex-col flex-grow min-h-0 overflow-hidden">
            <div className="scroll w-full flex-grow overflow-y-auto overflow-x-hidden !py-5 !px-4 !mb-0">
                {
                    props?.data?.map((item, index) => {
                        return (
                            <div className="cartItem w-full flex items-center gap-4 border-b border-[rgba(0,0,0,0.1)] !pb-4 !mb-4" key={index}>
                                <div className="img w-[25%] overflow-hidden h-[80%] !rounded-lg">
                                    <Link to={`/product/${item?.productId}`} className='block group'>
                                        <img src={item?.image} className="w-full group-hover:scale-105" />
                                    </Link>
                                </div>

                                <div className="info w-[75%] !pr-4 relative !pt-3">
                                    <h4 className="text-[16px] font-[400px]">
                                        <Link to={`/product/${item?.productId}`} className='link transition-all'>
                                            {item?.productTitle?.substring(0, 20) + "..."}
                                        </Link>
                                    </h4>

                                    <p className='flex items-center gap-5 !mt-1 !mb-2'>
                                        <span>Qty: <span>{item?.quantity}</span></span>
                                        <span className='text-[#ff5252] font-bold'>Price: &#x20b9;{item?.price}</span>
                                    </p>

                                    {item?.size && <p className='text-[12px] !mb-1'>Size: {item.size}</p>}
                                    {item?.weight && <p className='text-[12px] !mb-1'>Weight: {item.weight}</p>}
                                    {item?.ram && <p className='text-[12px] !mb-1'>RAM: {item.ram}</p>}

                                    <MdOutlineDelete className='absolute top-[10px] right-[10px] cursor-pointer text-[20px] link transition-all'
                                        onClick={() => removeItem(item?._id)}
                                    />
                                </div>
                            </div>
                        )
                    })
                }

            </div>


            <div className='bottomSec flex-shrink-0 !w-full !overflow-hidden !pr-0 !pb-7 bg-white'>
                <div className='bottomInfo !py-2 !px-4 w-full border-t border-[rgba(0,0,0,0.1)] flex items-center justify-between flex-col'>
                    <div className='flex items-center justify-between w-full'>
                        <span className='text-[14px] font-[600]'>{context?.cartData?.length} item </span>
                        <span className='text-[#ff5252] !font-bold'>
                            {
                                (
                                    context?.cartData?.length !== 0 ?
                                        context?.cartData?.map(item => parseInt(item?.price) * Number(item?.quantity))
                                            .reduce((total, value) => total + value, 0) : 0)?.toLocaleString('en-US',
                                                {
                                                    style: 'currency',
                                                    currency: 'INR'
                                                }
                                            )
                            }
                        </span>
                    </div>

                    {/* <div className='flex items-center justify-between w-full border-b border-[rgba(0,0,0,0.1)] !pb-4 !mb-4'>
                        <span>Shipping</span>
                        <span className='text-[#ff5252] !font-bold'> $5.00</span>
                    </div> */}
                </div>
                <div className='bottomInfo !px-4 w-full flex items-center justify-between flex-col'>
                    <div className='flex items-center justify-between w-full'>
                        <span>Total(tax excl.) </span>
                        <span className='text-[#ff5252] !font-bold'>
                            {
                                (
                                    context?.cartData?.length !== 0 ?
                                        context?.cartData?.map(item => parseInt(item?.price) * Number(item?.quantity))
                                            .reduce((total, value) => total + value, 0) : 0)?.toLocaleString('en-US',
                                                {
                                                    style: 'currency',
                                                    currency: 'INR'
                                                }
                                            )
                            }
                        </span>
                    </div>

                    {/* <div className='flex items-center justify-between w-full'>
                        <span>Total(tax incl.)</span>
                        <span className='text-[#ff5252] !font-bold'> $93.00</span>
                    </div> */}

                    {/* <div className='flex items-center justify-between w-full'>
                        <span>Taxes:</span>
                        <span className='text-[#ff5252] !font-bold'> $0.00</span>
                    </div> */}


                    <div className='flex items-center justify-between w-full gap-1 !mb-0 !mt-6'>
                        <Link to="/cart" className='w-[50%] d-block' onClick={() => context.setOpenCartPanel(false)}>
                            <Button className='btn-org btn-lg w-full'>View Cart</Button>
                        </Link>
                        <Link to="/checkout" className='w-[50%] d-block' onClick={() => context.setOpenCartPanel(false)}>
                            <Button className='btn-org btn-border btn-lg w-full'>Checkout</Button>
                        </Link>
                    </div>



                </div>
            </div>
        </div>
    )
}

export default CartPanel