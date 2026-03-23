import React, { useContext, useEffect, useState } from 'react'
import Button from '@mui/material/Button';
import { BsFillBagFill } from "react-icons/bs";
import CartItems from './cartItems';
import { MyContext } from '../../App';
import { Link } from 'react-router-dom';

const CartPage = () => {
    const context = useContext(MyContext);

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <section className='section !py-10 !pb-10'>
            <div className='container !w-[90%] !max-w-[90%] flex items-start gap-5'>
                <div className='leftPart w-[70%]'>

                    <div className='!shadow-md !rounded-md !bg-white'>
                        <div className='  !p-3 !w-full !border-b border-[rgba(0,0,0,0.1)]'>
                            <h2>Your Cart</h2>
                            <p className='!mt-0'>There are <span className='font-bold text-[#ff5252]'>{context?.cartData?.length}</span> products in your cart</p>
                        </div>

                        {
                            context?.cartData?.length !== 0 ? context?.cartData?.map((item, index) => {
                                return (
                                    <CartItems qty={item?.quantity} key={index} item={item} />
                                )
                            })
                                :
                                <>
                                    <div className='flex items-center justify-center !py-10 flex-col h-full '>
                                        <img src="/empty-cart.png" className='w-[150px] h-[150px] !mb-0' />
                                        <p className='text-[14px] font-[500] text-[rgba(0,0,0,0.7)] !mt-0'>Cart is empty</p>
                                        <Link to="/">
                                            <Button className="btn-org btn-sm !mt-4 !mb-5">
                                                Continue Shopping
                                            </Button>
                                        </Link>
                                    </div>
                                </>
                        }
                    </div>
                </div>


                <div className='rightPart w-[25%] sticky !top-20'>
                    <div className='!shadow-md !rounded-md !bg-white !p-5'>
                        <h3 className='!pb-3'>Cart Details</h3>
                        <hr />
                        <p className='flex items-center justify-between'>
                            <span className='text-[14px] font-[500]'>Subtotal</span>
                            <span className='text-red-500 font-bold'>&#x20b9;{context?.cartData?.reduce((total, item) => total + item?.subTotal, 0).toLocaleString("en-IN")}</span>
                        </p>
                        <p className='flex items-center justify-between'>
                            <span className='text-[14px] font-[500]'>Shipping</span>
                            <span className=' font-bold'>Free</span>
                        </p>
                        <p className='flex items-center justify-between'>
                            <span className='text-[14px] font-[500]'>Estimate for</span>
                            <span className=' font-bold'>United Kingdom</span>
                        </p>
                        <p className='flex items-center justify-between'>
                            <span className='text-[14px] font-[500]'>Total</span>
                            <span className='text-red-500 font-bold'>&#x20b9;{context?.cartData?.reduce((total, item) => total + item?.subTotal, 0).toLocaleString("en-IN")}</span>
                        </p>
                        <br />
                        <Link to="/checkout">
                            <Button className='btn-org btn-lg w-full flex gap-2'><BsFillBagFill className='text-[14px]' />
                                Checkout
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CartPage