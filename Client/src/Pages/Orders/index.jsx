import React, { useEffect, useState } from 'react'
import AccountSidebar from '../../components/AccountSidebar'
import { Button } from '@mui/material'
import { FaAngleDown, FaAngleUp } from 'react-icons/fa'
import Badge from '../../components/Badge'
import { Collapse } from 'react-collapse';
import { fetchDataFromApi } from '../../utils/api'


const Orders = () => {

    const [isOpenOrderedProduct, setIsOpenOrderedProduct] = useState(null);
    const [orders, setOrders] = useState([]);
    const isShowOrderedProduct = (index) => {
        if (isOpenOrderedProduct === index) {
            setIsOpenOrderedProduct(null);

        } else {
            setIsOpenOrderedProduct(index);
        }
    }

    useEffect(() => {
        fetchDataFromApi("/api/order/order-list").then((res) => {
            if (res?.error === false) {
                setOrders(res?.data)
            }
        })
    }, [])
    return (

        <section className='!py-10 w-full'>
            <div className='container flex flex-col lg:flex-row gap-5 px-4 lg:px-0'>
                <div className='col1 hidden lg:block w-[20%]'>
                    <AccountSidebar />
                </div>

                <div className='col2 w-full lg:w-[80%]'>
                    <div className='!shadow-md !rounded-md !bg-white'>
                        <div className='  !p-3 !w-full !border-b border-[rgba(0,0,0,0.1)]'>
                            <h2>My Order</h2>

                            <p className='!mt-0'>There are <span className='font-bold text-[#ff5252]'>{orders?.length} </span>products in my list
                            </p>

                            <div className="relative overflow-x-auto !mt-5 bg-white !shadow-xs rounded-md !border !border-[rgba(0,0,0,0.1)]">
                                <table className="w-full text-sm text-left rtl:text-right text-body border-collapse">
                                    <thead className="text-sm text-body bg-[#f1f1f1] !border-b !border-[rgba(0,0,0,0.1)]">
                                        <tr>
                                            <th scope="col" className="!px-6 !py-3 font-medium">
                                                &nbsp;
                                            </th>
                                            <th scope="col" className="!px-6 !py-3 font-medium whitespace-nowrap">
                                                Order Id
                                            </th>
                                            <th scope="col" className="!px-6 !py-3 font-medium whitespace-nowrap">
                                                Payment Id
                                            </th>
                                            <th scope="col" className="!px-6 !py-3 font-medium whitespace-nowrap">
                                                Name
                                            </th>
                                            <th scope="col" className="!px-6 !py-3 font-medium whitespace-nowrap">
                                                Phone Number
                                            </th>
                                            <th scope="col" className="!px-6 !py-3 font-medium whitespace-nowrap">
                                                Address
                                            </th>
                                            <th scope="col" className="!px-6 !py-3 font-medium whitespace-nowrap">
                                                Pin Code
                                            </th>
                                            <th scope="col" className="!px-6 !py-3 font-medium whitespace-nowrap">
                                                Total Amount
                                            </th>
                                            <th scope="col" className="!px-6 !py-3 font-medium whitespace-nowrap">
                                                Email
                                            </th>
                                            <th scope="col" className="!px-6 !py-3 font-medium whitespace-nowrap">
                                                User ID
                                            </th>
                                            <th scope="col" className="!px-6 !py-3 font-medium whitespace-nowrap">
                                                Order Status
                                            </th>
                                            <th scope="col" className="!px-6 !py-3 font-medium whitespace-nowrap">
                                                Date
                                            </th>

                                        </tr>
                                    </thead>
                                    <tbody>

                                        {
                                            orders?.length !== 0 && orders?.map((order, index) => {
                                                return (
                                                    <>
                                                        <tr className="!bg-white !border-b !border-[rgba(0,0,0,0.1)] hover:!bg-gray-50">
                                                            <td className="!px-6 !py-4">
                                                                <Button className='!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-[#f1f1f1]'
                                                                    onClick={() => isShowOrderedProduct(index)}>
                                                                    {
                                                                        isOpenOrderedProduct === index ?
                                                                            <FaAngleUp className='text-[16px] text-[rgba(0,0,0,0.7)]' /> :
                                                                            <FaAngleDown className='text-[16px] text-[rgba(0,0,0,0.7)]' />
                                                                    }
                                                                </Button>
                                                            </td>

                                                            <td className="!px-6 !py-4">
                                                                <span className='text-red-500'>{order?._id}</span>
                                                            </td>

                                                            <td className="!px-6 !py-4">
                                                                <span className='text-red-500'>{order?.paymentId}</span>
                                                            </td>

                                                            <td className="!px-6 !py-4 whitespace-nowrap">
                                                                {order?.delivery_address?.fullName}
                                                            </td>

                                                            <td className="!px-6 !py-4">
                                                                {order?.delivery_address?.mobile}
                                                            </td>
                                                            <td className="!px-6 !py-4">
                                                                <span className='block w-[400px]'>
                                                                    {order?.delivery_address ? (
                                                                        `${order?.delivery_address?.address_line1}, ${order?.delivery_address?.city}, ${order?.delivery_address?.state}, ${order?.delivery_address?.country}`
                                                                    ) : (
                                                                        <span className='text-gray-400 italic'>No specific delivery address found</span>
                                                                    )}
                                                                </span>
                                                            </td>

                                                            <td className="!px-6 !py-4">
                                                                {order?.delivery_address?.pincode || "N/A"}
                                                            </td>
                                                            <td className="!px-6 !py-4">
                                                                {order?.totalAmt}
                                                            </td>

                                                            <td className="!px-6 !py-4">
                                                                {order?.userId?.email}
                                                            </td>

                                                            <td className="!px-6 !py-4">
                                                                <span className='text-red-500'>{order?.userId?._id}</span>
                                                            </td>

                                                            <td className="!px-6 !py-4">
                                                                <Badge status={order?.order_status} />
                                                            </td>

                                                            <td className="!px-6 !py-4 whitespace-nowrap">
                                                                {new Date(order?.createdAt).toLocaleDateString()}
                                                            </td>
                                                        </tr>


                                                        {
                                                            isOpenOrderedProduct === index && (
                                                                <tr>
                                                                    <td className='!pl-25 !py-4' colSpan="12">
                                                                        <div className="relative overflow-x-auto bg-white !shadow-xs rounded-md !border !border-[rgba(0,0,0,0.1)]">
                                                                            <table className="w-full text-sm text-left rtl:text-right text-body border-collapse">
                                                                                <thead className="text-sm text-body bg-[#f1f1f1] !border-b !border-[rgba(0,0,0,0.1)]">
                                                                                    <tr>
                                                                                        <th scope="col" className="!px-6 !py-3 font-medium whitespace-nowrap">
                                                                                            Product Id
                                                                                        </th>
                                                                                        <th scope="col" className="!px-6 !py-3 font-medium whitespace-nowrap">
                                                                                            Product Details
                                                                                        </th>

                                                                                        <th scope="col" className="!px-6 !py-3 font-medium whitespace-nowrap">
                                                                                            Image
                                                                                        </th>
                                                                                        <th scope="col" className="!px-6 !py-3 font-medium whitespace-nowrap">
                                                                                            Quantity
                                                                                        </th>
                                                                                        <th scope="col" className="!px-6 !py-3 font-medium whitespace-nowrap">
                                                                                            Price
                                                                                        </th>
                                                                                        <th scope="col" className="!px-6 !py-3 font-medium whitespace-nowrap">
                                                                                            Sub Total
                                                                                        </th>


                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                    {
                                                                                        order?.products?.map((product, pIndex) => (
                                                                                            <tr key={pIndex} className="!bg-white !border-b !border-[rgba(0,0,0,0.1)] hover:!bg-gray-50">
                                                                                                <td className="!px-6 !py-4">
                                                                                                    <span className='text-gray-600'>{product?.productId}</span>
                                                                                                </td>

                                                                                                <td className="!px-6 !py-4">
                                                                                                    <span className='text-gray-600'>{product?.productTitle?.slice(0, 20)}...</span>
                                                                                                </td>

                                                                                                <td className="!px-6 !py-4 whitespace-nowrap">
                                                                                                    <img src={product?.image}
                                                                                                        className='w-[40px] h-[40px] object-cover whitespace-nowrap !rounded-md' />
                                                                                                </td>

                                                                                                <td className="!px-6 !py-4">
                                                                                                    {product?.quantity}
                                                                                                </td>

                                                                                                <td className="!px-6 !py-4">
                                                                                                    <span className='block'>{(product?.price)?.toLocaleString('en-US', {
                                                                                                        style: 'currency',
                                                                                                        currency: 'INR',
                                                                                                    })}</span>
                                                                                                </td>

                                                                                                <td className="!px-6 !py-4">
                                                                                                    {(product?.price * product?.quantity)?.toLocaleString('en-US', {
                                                                                                        style: 'currency',
                                                                                                        currency: 'INR',
                                                                                                    })}
                                                                                                </td>
                                                                                            </tr>
                                                                                        ))
                                                                                    }
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        }
                                                    </>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Orders