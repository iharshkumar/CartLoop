import { Button, TablePagination } from '@mui/material'
import React, { useState } from 'react'
import { FaAngleDown, FaAngleUp } from 'react-icons/fa6'
import Badge from '../../components/Badge';
import SearchBox from '../../Components/SearchBox';
import { useEffect } from 'react';
import { editData, fetchDataFromApi } from '../../utils/api';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { MyContext } from '../../App.jsx';
import { useContext } from 'react';


const Orders = () => {

    const [isOpenOrderedProduct, setIsOpenOrderedProduct] = useState(null);
    const [orders, setOrders] = useState([]);
    const [totalOrders, setTotalOrders] = useState(0);
    const [orderPage, setOrderPage] = useState(0);
    const [orderRowsPerPage, setOrderRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');

    const [ordersData, setOrdersData] = useState([]);
    const [totalOrdersData, setTotalOrdersData] = useState([]);
    const context = useContext(MyContext)

    const isShowOrderedProduct = (index) => {
        if (isOpenOrderedProduct === index) {
            setIsOpenOrderedProduct(null);

        } else {
            setIsOpenOrderedProduct(index);
        }
    }

    const handleChangeOrderRowsPerPage = (event) => {
        setOrderRowsPerPage(+event.target.value);
        setOrderPage(0);
    };

    const handleChangeOrderPage = (event, newPage) => {
        setOrderPage(newPage);
    };

    const [orderStatus, setOrderStatus] = useState('');

    const handleChange = (event, id) => {
        setOrderStatus(event.target.value);

        const obj = {
            id: id,
            order_status: event.target.value
        }
        editData(`/api/order/order-status/${id}`, obj).then((res) => {
            if (res?.data?.error === false) {
                context?.alertBox("success", res?.data?.message)
            }
        })
    };

    useEffect(() => {
        fetchDataFromApi(`/api/order/order-list?page=${orderPage + 1}&limit=${orderRowsPerPage}&all=true`).then((res) => {
            if (res?.error === false) {
                setOrders(res?.data)
                if (searchQuery === "") {
                    setOrdersData(res?.data)
                }
                setTotalOrders(res?.total)
            }
        })
    }, [orderPage, orderRowsPerPage, orderStatus, searchQuery])

    useEffect(() => {
        fetchDataFromApi("/api/order/order-list?all=true").then((res) => {
            if (res?.error === false) {
                setTotalOrdersData(res?.data)
            }
        })
    }, [orderStatus])

    const handleChangeRowsPerPage = (event) => {
        setOrderRowsPerPage(+event.target.value);
        setOrderPage(0);
    };

    useEffect(() => {
        if (searchQuery !== "") {
            setOrderPage(0);
            const filteredOrders = totalOrdersData?.filter((order) =>
                order?._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order?.userId?._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order?.userId?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order?.order_status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order?.totalAmt?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
                order?.delivery_address?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order?.delivery_address?.mobile?.toString().includes(searchQuery.toLowerCase()) ||
                order?.delivery_address?.addressType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order?.delivery_address?.pinCode?.toString().includes(searchQuery.toLowerCase()) ||
                order?.createdAt?.toString().includes(searchQuery)
            )
            setOrdersData(filteredOrders)
        }

        else {
            setOrdersData(orders)
        }
    }, [searchQuery, totalOrdersData])

    return (
        <div className='card !my-2 md:!mt-4 !shadow-md sm:rounded-lg !bg-white' >
            <div className='grid grid-cols-1 lg:grid-cols-2 flex-col sm:flex-row w-full gap-4 !px-5 !py-5'>
                <h2 className='text-[18px] !font-[600] text-left !mb-2 lg:!mb-0'>Recent Orders</h2>
                <div className='ml-auto w-full'>
                    <SearchBox
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        setPageOrder={() => setOrderPage(0)}
                    />
                </div>
            </div>


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
                            Array.isArray(ordersData) && ordersData?.length !== 0 &&
                            (searchQuery !== "" ?
                                ordersData.slice(orderPage * orderRowsPerPage, orderPage * orderRowsPerPage + orderRowsPerPage) :
                                ordersData).map((order, index) => {
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
                                                    {order?.userId?.mobile}
                                                </td>
                                                <td className="!px-6 !py-4">
                                                    <span className='block w-[400px]'>
                                                        {order?.delivery_address ? (
                                                            `${order?.delivery_address?.address_line1}, ${order?.delivery_address?.city}, ${order?.delivery_address?.state}, ${order?.delivery_address?.country} , ${order?.delivery_address?.mobile}`
                                                        ) : (
                                                            <span className='text-gray-400 italic'>No specific delivery address found</span>
                                                        )}
                                                    </span>
                                                </td>

                                                <td className="!px-6 !py-4">
                                                    {order?.delivery_address?.pincode}
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
                                                    <Select
                                                        value={order?.order_status !== null !== null ? order?.order_status : orderStatus}
                                                        onChange={(e) => handleChange(e, order?._id)}
                                                        displayEmpty
                                                        inputProps={{ 'aria-label': 'Without label' }}
                                                        size='small'
                                                        style={{ zoom: '80%' }}
                                                        className='!h-[35px] w-full'
                                                    >
                                                        <MenuItem value={'pending'}>Pending</MenuItem>
                                                        <MenuItem value={'confirm'}>Confirm</MenuItem>
                                                        <MenuItem value={'deliver'}>Delivered</MenuItem>
                                                    </Select>
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
                                                )}
                                        </>
                                    )
                                })
                        }
                    </tbody>
                </table>
            </div>

            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={searchQuery !== "" ? ordersData?.length : totalOrders}
                rowsPerPage={orderRowsPerPage}
                page={orderPage}
                onPageChange={handleChangeOrderPage}
                onRowsPerPageChange={handleChangeOrderRowsPerPage}
            />


        </div>
    )
}

export default Orders