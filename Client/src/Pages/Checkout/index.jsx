import React, { useContext, useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { BsFillBagCheckFill, BsFillBagFill } from 'react-icons/bs';
import { MyContext } from '../../App';
import { FaPlus } from 'react-icons/fa6';
import Radio from '@mui/material/Radio';
import { deleteData, postData } from '../../utils/api';
import axios from 'axios';
import { PayPalButtons } from "@paypal/react-paypal-js";

const VITE_APP_RAZORPAY_KEY_ID = import.meta.env.VITE_APP_RAZORPAY_KEY_ID;
const VITE_APP_RAZORPAY_KEY_SECRET = import.meta.env.VITE_APP_RAZORPAY_KEY_SECRET;
const VITE_API_URL = import.meta.env.VITE_API_URL;

const Checkout = () => {
    const context = useContext(MyContext);
    const [isChecked, setIsChecked] = useState(0);
    const [selectedAddress, setSelectedAddress] = useState('');
    const [totalAmount, setTotalAmount] = useState(0);

    const navigate = useNavigate();
    const totalAmountRef = useRef(totalAmount);
    const selectedAddressRef = useRef(selectedAddress);
    const cartDataRef = useRef(context?.cartData);
    const userDataRef = useRef(context?.userData);

    useEffect(() => {
        totalAmountRef.current = totalAmount;
        selectedAddressRef.current = selectedAddress;
        cartDataRef.current = context?.cartData;
        userDataRef.current = context?.userData;
    }, [totalAmount, selectedAddress, context?.cartData, context?.userData]);

    const editAddress = (id) => {
        context?.setEditId(id);
        context?.toggleAddressPanel(true);
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        if (context?.address?.length > 0) {
            setSelectedAddress(context?.address[0]?._id);
        } else if (context?.userData?.address_details?.length > 0) {
            const firstAddr = context?.userData?.address_details[0];
            setSelectedAddress(typeof firstAddr === 'object' ? firstAddr?._id : firstAddr);
        }
    }, [context?.userData, context?.address])

    useEffect(() => {
        const total = context?.cartData?.length !== 0 ?
            context?.cartData?.map(item => parseInt(item?.price) * item?.quantity)
                .reduce((total, value) => total + value, 0) : 0;
        setTotalAmount(total);
    }, [context?.cartData])

    const createPaypalOrder = async () => {
        if (context?.address?.length !== 0) {
            try {
                const resp = await fetch(
                    "https://v6.exchangerate-api.com/v6/8f85eea95dae9336b9ea3ce9/latest/INR"
                );
                const respData = await resp.json();

                if (respData?.result !== "success") {
                    throw new Error("Currency conversion failed");
                }

                const usdToInrRate = respData?.conversion_rates?.USD;
                const convertedAmount = (totalAmountRef.current * usdToInrRate).toFixed(2);

                const headers = {
                    'Authorization': `Bearer ${localStorage.getItem('accesstoken')}`,
                    'Content-Type': 'application/json',
                };

                const response = await axios.post(
                    VITE_API_URL + `/api/order/create-order-paypal`,
                    { userId: userDataRef.current?._id, totalAmount: convertedAmount },
                    { headers }
                );

                if (!response?.data?.id) throw new Error("No order ID returned");
                return response?.data?.id;

            } catch (error) {
                console.error("PayPal createOrder error:", error);
                throw error;
            }
        } else {
            context?.alertBox("error", "Please add address");
        }
    };

    const onApprovePayment = async (data, actions) => {
        if (context?.address?.length !== 0) {
            try {
                const user = userDataRef.current;
                const info = {
                    userId: user?._id,
                    products: cartDataRef.current?.map(p => ({
                        ...p,
                        subTotal: p.price * p.quantity
                    })),
                    payment_status: "COMPLETED",
                    delivery_address: selectedAddressRef.current,
                    totalAmt: totalAmountRef.current,
                    date: new Date().toLocaleString('en-US', {
                        month: 'short', day: '2-digit', year: 'numeric',
                    })
                }

                const headers = {
                    'Authorization': `Bearer ${localStorage.getItem('accesstoken')}`,
                    'Content-Type': 'application/json',
                }

                const response = await axios.post(
                    VITE_API_URL + `/api/order/capture-order-paypal`,
                    { ...info, paymentId: data?.orderID },
                    { headers }
                )

                if (response.data.success) {
                    await deleteData(`/api/cart/emptyCart/${user?._id}`);
                    await context?.getCartItems();
                    context?.alertBox("success", response?.data?.message);
                    navigate("/orders/success");
                } else {
                    context?.alertBox("error", "Payment failed! Please try again.");
                    navigate("/orders/failed");
                }

            } catch (error) {
                const errorDetail = error.response?.data?.message;
                if (errorDetail && errorDetail.includes("INSTRUMENT_DECLINED")) {
                    return actions.restart();
                }
                context?.alertBox("error", "Something went wrong! Please try again.");
                navigate("/orders/failed");
            }
        } else {
            context?.alertBox("error", "Please add address");
        }
    }

    const handleChange = (e, index) => {
        if (e.target.checked) {
            setIsChecked(index);
            setSelectedAddress(e.target.value);
        }
    }

    const checkout = (e) => {
        e.preventDefault();
        if (context?.address?.length !== 0) {
            var options = {
                "key": VITE_APP_RAZORPAY_KEY_ID,
                "key_secret": VITE_APP_RAZORPAY_KEY_SECRET,
                "amount": parseInt(totalAmount * 100),
                "currency": "INR",
                "order_receipt": context?.userData?.name,
                "name": "ShopMania",
                "description": "Test Transaction",
                "handler": function (response) {
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
                            month: 'short', day: '2-digit', year: 'numeric',
                        })
                    }
                    postData(`/api/order/create`, payload).then((res) => {
                        context?.alertBox("success", res?.message);
                        if (res?.error === false) {
                            deleteData(`/api/cart/emptyCart/${user}`).then(() => {
                                context?.getCartItems();
                            })
                            navigate("/orders/success");
                        } else {
                            navigate("/orders/failed");
                            context?.alertBox("error", res?.message);
                        }
                    })
                },
                theme: { color: '#ff5252' }
            };

            var pay = new Razorpay(options);
            pay.open();
        } else {
            context?.alertBox("error", "Please add address");
        }
    }

    const cashOnDelivery = () => {
        const user = context?.userData;

        if (context?.address?.length !== 0) {
            const payload = {
                userId: user?._id,
                products: context?.cartData,
                paymentId: "COD",
                payment_status: "CASH ON DELIVERY",
                delivery_address: selectedAddress,
                totalAmt: totalAmount,
                date: new Date().toLocaleString('en-US', {
                    month: 'short', day: '2-digit', year: 'numeric',
                })
            }
            postData(`/api/order/create`, payload).then((res) => {
                context?.alertBox("success", res?.message);
                if (res?.error === false) {
                    deleteData(`/api/cart/emptyCart/${user?._id}`).then(() => {
                        context?.getCartItems();
                    })
                    navigate("/orders/success");
                } else {
                    navigate("/orders/failed");
                    context?.alertBox("error", res?.message);
                }
            })
        }
        else {
            context?.alertBox("error", "Please add address");
        }

    }

    return (
        <section className='!py-10'>
            <form onSubmit={checkout}>
                <div className='w-full lg:w-[90%] xl:w-[80%] !mx-auto flex flex-col lg:flex-row gap-5 !px-4'>
                    <div className='leftCol w-full lg:w-[70%]'>
                        <div className='card w-full rounded-md bg-white shadow-md !p-5'>
                            <div className='flex items-center justify-between !mb-3'>
                                <h2>Select Delivery Address</h2>
                                <Button variant="outlined" className='!gap-2 !whitespace-nowrap'
                                    onClick={() => { context?.setEditId(null); context?.toggleAddressPanel(true); }}>
                                    <FaPlus /> Add New Address
                                </Button>
                            </div>
                            <div className='flex gap-4 flex-col'>
                                {context?.address?.length !== 0 ? context?.address?.map((address, index) => (
                                    <label key={index} className={`flex gap-3 !p-4 !border !border-[rgba(0,0,0,0.1)] !rounded-md relative ${isChecked === index && '!bg-[#f1faff]'}`}>
                                        <div>
                                            <Radio size='small'
                                                onChange={(e) => handleChange(e, index)}
                                                checked={isChecked === index}
                                                value={address?._id}
                                            />
                                        </div>
                                        <div className='info'>
                                            <span className='inline-block !px-3 !py-1 !text-[11px] !font-bold !bg-[#f1faff] !mb-2 !text-[#2bbef9] !rounded-md uppercase tracking-wide border border-[#2bbef9]'>
                                                {address?.addressType}
                                            </span>
                                            <h3 className='!mt-0 !mb-0'>{address?.fullName}</h3>
                                            <p className='!mt-0 !mb-0'>Mobile : +{address?.mobile}</p>
                                            <p className='!mt-0 !mb-0'>{address?.address_line1}</p>
                                            <p className='!mt-0 !mb-0'>{address?.city}, {address?.state}, {address?.pincode}</p>
                                        </div>
                                        <Button variant='text'
                                            className='!absolute !top-[15px] !right-[15px] !btn-sm font-bold'
                                            onClick={() => editAddress(address?._id)}>Edit
                                        </Button>
                                    </label>
                                )) : (
                                    <div className='flex flex-col !mt-5 items-center justify-center !p-5'>
                                        <img src="/relocation.png" className='w-[100px] h-[100px]' />
                                        <h2 className='text-center !mb-0 !mt-0'>No Address Found</h2>
                                        <p className='text-center !mt-0 !mb-0'>Add an address to continue</p>
                                        <Button variant="outlined" className='!gap-2 !mt-2 btn-org'
                                            onClick={() => { context?.setEditId(null); context?.toggleAddressPanel(true); }}>
                                            <FaPlus /> Add Address
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className='rightCol w-full lg:w-[30%] '>
                        <div className='card !shadow-md !rounded-md !bg-white !p-5'>
                            <h3 className='!mb-4'>Your Order</h3>
                            <div className='flex items-center justify-between !py-3 !px-2 border-t border-b border-[rgba(0,0,0,0.1)]'>
                                <span className='text-[14px] font-[600]'>Product</span>
                                <span className='text-[14px] font-[600]'>Subtotal</span>
                            </div>

                            <div className='!mt-3 scroll max-h-[250px] overflow-y-scroll overflow-x-hidden !pr-2'>
                                {context?.cartData?.length !== 0 && context?.cartData?.map((item, index) => (
                                    <div key={index} className='flex items-center justify-between !py-2'>
                                        <div className='part1 flex items-center gap-3'>
                                            <div className='img w-[30%] !h-[70px] object-cover !overflow-hidden !rounded-md group cursor-pointer'>
                                                <img src={item?.image} className='w-full transition-all group-hover:scale-105' />
                                            </div>
                                            <div className='info'>
                                                <h4 className='text-[14px]'>{item?.productTitle?.substr(0, 20) + "..."}</h4>
                                                <span className='text-[14px]'>Qty : {item?.quantity}</span>
                                            </div>
                                        </div>
                                        <span className='text-[14px] font-[500]'>&#x20b9;{item?.price * item?.quantity}</span>
                                    </div>
                                ))}
                            </div>

                            <div className='flex flex-col gap-3 !mt-4'>
                                <Button type='submit' className='btn-org btn-lg w-full flex gap-2'>
                                    <BsFillBagFill className='text-[14px]' /> Checkout
                                </Button>

                                <PayPalButtons
                                    style={{
                                        layout: "vertical",
                                        color: "gold",
                                        shape: "rect",
                                        label: "checkout",
                                        height: 45,
                                        tagline: false
                                    }}
                                    className={`${context?.address?.length === 0 ? "!pointer-events-none" : ""}`}
                                    fundingSource="paypal"
                                    createOrder={createPaypalOrder}
                                    onApprove={(data, actions) => onApprovePayment(data, actions)}
                                    onError={(err) => {
                                        context?.alertBox("error", "PayPal payment failed!");
                                        navigate("/orders/failed");
                                    }}
                                />

                                <Button type="button" className='btn-dark btn-lg w-full flex gap-2 items-center'
                                    onClick={cashOnDelivery}>
                                    <BsFillBagCheckFill className='text-[14px]' /> Cash On Delivery
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </section>
    )
}

export default Checkout