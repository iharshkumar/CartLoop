import React, { useState } from 'react'
import Button from '@mui/material/Button';
import { BsFillBagFill } from "react-icons/bs";
import MyListItems from './MyListItems';
import AccountSidebar from '../../components/AccountSidebar';
import { MyContext } from '../../App';
import { useContext } from 'react';
import { Link } from 'react-router-dom';



const MyList = () => {
    const context = useContext(MyContext)

    return (

        <section className='!py-10 w-full'>
            <div className='container flex gap-5'>
                <div className='col1 w-[20%]'>
                    <AccountSidebar />
                </div>


                <div className='col2 w-[70%] '>
                    <div className='!shadow-md !rounded-md !bg-white'>
                        <div className='  !p-3 !w-full !border-b border-[rgba(0,0,0,0.1)]'>
                            <h2>My List</h2>
                            <p className='!mt-0'>There are <span className='font-bold text-[#ff5252]'>{context?.myListData?.length}</span> products in my list</p>
                        </div>

                        {
                            context?.myListData?.length !== 0 ? context?.myListData?.map((item, index) => {
                                return (
                                    <MyListItems key={item?._id} item={item} />
                                )
                            })

                                :
                                <>
                                    <div className='flex items-center justify-center !py-10 flex-col h-full '>
                                        <img src="/list.png" className='w-[125px] h-[125px] !mb-0' />
                                        <p className='text-[14px] font-[500] text-[rgba(0,0,0,0.7)] !mt-0'>Your Wishlist is empty</p>
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
            </div>
        </section >


    )
}

export default MyList;