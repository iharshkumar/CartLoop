import React, { useEffect, useState } from 'react'
import AccountSidebar from '../../components/AccountSidebar'
import { Button } from '@mui/material'
import { FaAngleDown, FaAngleUp, FaBox, FaGift, FaTruck, FaShippingFast, FaCheckCircle } from "react-icons/fa";
import Badge from '../../components/Badge'
import { Collapse } from 'react-collapse';
import { fetchDataFromApi } from '../../utils/api'


const Orders = () => {
  const STAGE_ICONS = {
    ORDER_PLACED: <FaBox />,
    PACKED: <FaGift />,
    SHIPPED: <FaTruck />,
    OUT_FOR_DELIVERY: <FaShippingFast />,
    DELIVERED: <FaCheckCircle />,
  };

  const [isOpenOrderedProduct, setIsOpenOrderedProduct] = useState(null);
  const [orders, setOrders] = useState([]);
  const [pipeline, setPipeline] = useState([]);
  const isShowOrderedProduct = (index) => {
    if (isOpenOrderedProduct === index) {
      setIsOpenOrderedProduct(null);

    } else {
      setIsOpenOrderedProduct(index);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("accesstoken");
    const headers = { Authorization: `Bearer ${token}` };
    const VITE_API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

    // Fetch Pipeline
    fetch(`${VITE_API_URL}/api/orders/pipeline`, { headers })
      .then(res => res.json())
      .then(res => res.success && setPipeline(res.data));

    // Fetch Orders
    fetch(`${VITE_API_URL}/api/orders`, { headers })
      .then(res => res.json())
      .then((res) => {
        if (res?.success === true) {
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
                      <th scope="col" className="!px-6 !py-3 font-medium whitespace-nowrap !text-center">
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

                              <td className="!px-6 !py-4 whitespace-nowrap">
                                <span className='text-red-500'>{order.id}</span>
                              </td>
                              <td className="!px-6 !py-4 whitespace-nowrap">
                                <span className='text-red-500'>{order.paymentId}</span>
                              </td>
                              <td className="!px-6 !py-4 whitespace-nowrap">
                                {order.customerName}
                              </td>
                              <td className="!px-6 !py-4">
                                {order.mobile}
                              </td>
                              <td className="!px-6 !py-4">
                                <span className='block w-[300px] line-clamp-2'>
                                  {order.address}
                                </span>
                              </td>
                              <td className="!px-6 !py-4">
                                {order.address.split(',').pop()?.trim() || "N/A"}
                              </td>
                              <td className="!px-6 !py-4 font-bold">
                                {order.totalAmt}
                              </td>
                              <td className="!px-6 !py-4">
                                {order.email}
                              </td>
                              <td className="!px-6 !py-4">
                                <span className='text-red-500'>{order.userId?._id || "N/A"}</span>
                              </td>
                              <td className="!px-6 !py-4 !text-center">
                                <div className="flex flex-col items-center !justify-center gap-2">
                                  <Badge status={order.current_status} label={order.status_label} />
                                </div>
                              </td>

                              <td className="!px-6 !py-4 whitespace-nowrap">
                                {new Date(order?.createdAt).toLocaleDateString()}
                              </td>
                            </tr>


                            {
                              isOpenOrderedProduct === index && (
                                <tr>
                                  <td className='!pl-[40px] !py-6' colSpan="12">
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
                                                  <span className='block'>&#8377;{product?.price.toLocaleString('en-IN')}</span>
                                                </td>

                                                <td className="!px-6 !py-4">
                                                  &#8377;{(product?.price * product?.quantity).toLocaleString('en-IN')}
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