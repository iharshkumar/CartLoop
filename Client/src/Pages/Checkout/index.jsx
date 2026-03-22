import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { BsFillBagCheckFill, BsFillBagFill } from 'react-icons/bs';
import { MyContext } from '../../App';
import { FaPlus } from 'react-icons/fa6';
import Radio from '@mui/material/Radio';
import { deleteData, fetchDataFromApi, postData } from '../../utils/api';

const VITE_APP_RAZORPAY_KEY_ID = import.meta.env.VITE_APP_RAZORPAY_KEY_ID;
const VITE_APP_RAZORPAY_KEY_SECRET = import.meta.env.VITE_APP_RAZORPAY_KEY_SECRET;

const Checkout = () => {
    const context = useContext(MyContext);
    const [isChecked, setIsChecked] = useState(0);
    const [selectedAddress, setSelectedAddress] = useState('');
    const [totalAmount, setTotalAmount] = useState();

    const navigate = useNavigate();
    const editAddress = (id) => {
        context?.setEditId(id)
        context?.toggleAddressPanel(true)
    }

    useEffect(() => {
        setSelectedAddress(context?.userData?.address_details[0]?._id)
        fetchDataFromApi(`/api/order/order-list`).then((res) => {
            console.log(res)
        })
    }, [context?.userData])

    useEffect(() => {
        setTotalAmount(
            context?.cartData?.length !== 0 ?
                context?.cartData?.map(item => parseInt(item?.price) * item?.quantity)
                    .reduce((total, value) => total + value, 0) : 0)
            ?.toLocaleString('en-US', { style: 'currency', currency: 'INR' }

            );

        // localStorage.setItem('totalAmount', context?.cartData?.length !== 0 ?
        //     context?.cartData?.map(item => parseInt(item?.price) * item?.quantity)
        //         .reduce((total, value) => total + value, 0) : 0)
        //     ?.toLocaleString('en-US', { style: 'currency', currency: 'INR' })

    }, [context?.cartData])

    const handleChange = (e, index) => {
        if (e.target.checked) {
            setIsChecked(index);
            setSelectedAddress(e.target.value);
        }
    }

    const checkout = (e) => {
        e.preventDefault();
        var options = {
            "key": VITE_APP_RAZORPAY_KEY_ID,
            "key_secret": VITE_APP_RAZORPAY_KEY_SECRET,
            "amount": parseInt(totalAmount * 100),
            "currency": "INR",
            "order_receipt": context?.userData?.name,
            "name": "ShopMania",
            "description": "Test Transaction",
            "handler": function (response) {
                console.log(response);
                const paymentId = response?.razorpay_payment_id;
                const user = context?.userData?._id;
                const payload = {
                    userId: user,
                    products: context?.cartData,
                    paymentId: paymentId,
                    payment_status: "Completed",
                    delivery_address: selectedAddress,
                    totalAmt: totalAmount,
                    date: new Date().toLocaleString('en-US', {
                        month: 'short',
                        day: '2-digit',
                        year: 'numeric',
                    })
                }

                postData(`/api/order/create`, payload).then((res) => {
                    context?.alertBox("success", res?.message);
                    if (res?.error === false) {
                        deleteData(`/api/cart/emptyCart/${user}`).then((res) => {
                            context?.getCartItems();

                        })
                        navigate("/");
                    }
                    else {
                        context?.alertBox("error", res?.message);
                    }
                })

            },
            theme: {
                color: '#ff5252'
            }
        };
        var pay = new Razorpay(options);
        pay.open();
    }

    const cashOnDelivery = () => {
        const user = context?.userData;
        const payload = {
            userId: user?._id,
            products: context?.cartData,
            paymentId: "COD",
            payment_status: "CASH ON DELIVERY",
            delivery_address: selectedAddress,
            totalAmt: totalAmount,
            date: new Date().toLocaleString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric',
            })
        }

        postData(`/api/order/create`, payload).then((res) => {
            context?.alertBox("success", res?.message);
            if (res?.error === false) {
                deleteData(`/api/cart/emptyCart/${user}`).then((res) => {
                    context?.getCartItems();

                })
                navigate("/");
            }
            else {
                context?.alertBox("error", res?.message);
            }
        })
    }


    return (
        <section className='!py-10'>
            <form onSubmit={checkout}>
                <div className='w-[80%] !mx-auto flex  gap-5'>
                    <div className='leftCol w-[70%]'>
                        <div className='card w-full rounded-md bg-white shadow-md !p-5'>
                            <div className='flex items-center justify-between !mb-3'>
                                <h2>Select Delivery Address</h2>
                                <Button variant="outlined"
                                    className='!gap-2'
                                    onClick={() => { context?.setEditId(null); context?.toggleAddressPanel(true); }}
                                >
                                    <FaPlus />
                                    Add New Address
                                </Button>
                            </div>

                            <div className='flex gap-4 flex-col'>
                                {
                                    context?.address?.length !== 0 ? context?.address?.map((address, index) => {
                                        return (
                                            <label key={index} className={`flex gap-3 !p-4 !border !border-[rgba(0,0,0,0.1)] !rounded-md relative ${isChecked === index && '!bg-[#f1faff]'}`}>
                                                <div>
                                                    <Radio size='small'
                                                        onChange={(e) => handleChange(e, index)}
                                                        checked={isChecked === index}
                                                        value={address?._id}
                                                    />
                                                </div>
                                                <div className='info'>
                                                    <span className='inline-block !px-3 !py-1 !text-[11px] !font-bold !bg-[#f1faff] !mb-2 !text-[#2bbef9] !rounded-md uppercase tracking-wide border border-[#2bbef9]'>{address?.addressType}</span>
                                                    <h3 className='!mt-0 !mb-0'>{address?.fullName}</h3>
                                                    <p className='!mt-0 !mb-0'>Mobile : +{address?.mobile}</p>
                                                    <p className='!mt-0 !mb-0'>{address?.address_line1} </p>
                                                    <p className='!mt-0 !mb-0'>{address?.city}, {address?.state}, {address?.pincode}</p>
                                                </div>

                                                <Button variant='text'
                                                    className='!absolute !top-[15px] !right-[15px] !btn-sm font-bold'
                                                    onClick={() => editAddress(address?._id)}
                                                >Edit</Button>
                                            </label>
                                        )
                                    })
                                        :

                                        <>
                                            <div className='flex flex-col !mt-5 items-center justify-center !p-5'>
                                                <img src="/relocation.png" className='w-[100px] h-[100px]' />
                                                <h2 className='text-center !mb-0 !mt-0'>No Address Found in your account</h2>
                                                <p className='text-center !mt-0 !mb-0'>Add an address to continue</p>
                                                <Button variant="outlined"
                                                    className='!gap-2 !mt-2 btn-org '
                                                    onClick={() => { context?.setEditId(null); context?.toggleAddressPanel(true); }}
                                                >
                                                    <FaPlus />
                                                    Add Address
                                                </Button>
                                            </div>
                                        </>
                                }
                            </div>

                        </div>
                    </div>


                    <div className='rightCol w-[30%]'>
                        <div className='card !shadow-md !rounded-md !bg-white !p-5'>
                            <h3 className='!mb-4'>Your Order</h3>
                            <div className='flex items-center justify-between !py-3 !px-2 border-t border-b border-[rgba(0,0,0,0.1)]'>
                                <span className='text-[14px] font-[600]'>Product</span>
                                <span className='text-[14px] font-[600]'>Subtotal</span>
                            </div>

                            <div className='!mt-3 scroll max-h-[250px] overflow-y-scroll overflow-x-hidden !pr-2'>
                                {
                                    context?.cartData?.length !== 0 && context?.cartData?.map((item, index) => {
                                        return (
                                            <div className='flex items-center justify-between !py-2'>
                                                <div className='part1 flex items-center gap-3'>
                                                    <div className='img w-[30%] !h-[70px] object-cover !overflow-hidden !rounded-md group cursor-pointer'>
                                                        <img src={item?.image}
                                                            className='w-full transition-all group-hover:scale-105' />
                                                    </div>

                                                    <div className='info '>
                                                        <h4 className='text-[14px]'>{item?.productTitle?.substr(0, 20) + "..."} </h4>
                                                        <span className='text-[14px]'>Qty : {item?.quantity}</span>
                                                    </div>
                                                </div>

                                                <span className='text-[14px] font-[500]'>&#x20b9;{item?.price * item?.quantity}</span>
                                            </div>
                                        )
                                    })
                                }

                            </div>
                            <div className='flex flex-col items-center gap-3! mb-2'>
                                <Button type='submit' className='!mt-4 btn-org btn-lg w-full flex gap-2'><BsFillBagFill className='text-[14px]' />
                                    Checkout
                                </Button>

                                <Button type="button" className='btn-dark btn-lg w-full flex gap-2 items-center'
                                    onClick={cashOnDelivery}
                                >
                                    <BsFillBagCheckFill className='text-[14px]' />
                                    Cash On Delivery
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>

        </section >
    )
}

export default Checkout