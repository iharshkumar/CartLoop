import React, { useContext } from 'react'
import { Button } from '@mui/material';
import { CgProfile } from "react-icons/cg";
import { IoIosListBox } from "react-icons/io";
import { BsBoxFill } from "react-icons/bs";
import { IoLogOut } from "react-icons/io5";
import { NavLink } from 'react-router-dom';
import { MyContext } from '../../App';
import { FaAddressBook } from "react-icons/fa";
import UserAvatar from '../UserAvatar/index.jsx';

const AccountSidebar = () => {
    const context = useContext(MyContext)

    return (
        <div className='card bg-white shadow-md rounded-md sticky top-[150px]'>
            <div className='w-full !p-3 flex items-center justify-center flex-col'>
                <UserAvatar showDetails={true} />
            </div>


            <ul className='list-none !pb-5 bg-[#f1f1f1] myAccountTabs'>
                <li className='w-full'>
                    <NavLink to="/my-account" exact={true} activeClassName="isActive" >
                        <Button className='w-full !text-left !py-2 !px-5 !justify-start !capitalise !text-[rgba(0,0,0,0.8)] !rounded-none flex items-center gap-2'>
                            <CgProfile className='text-[18px]' />
                            My Profile
                        </Button>
                    </NavLink>
                </li>

                <li className='w-full'>
                    <NavLink to="/address" exact={true} activeClassName="isActive" >
                        <Button className='w-full !text-left !py-2 !px-5 !justify-start !capitalise !text-[rgba(0,0,0,0.8)] !rounded-none flex items-center gap-2'>
                            <FaAddressBook className='text-[18px]' />
                            Address
                        </Button>
                    </NavLink>
                </li>

                <li className='w-full'>
                    <NavLink to="/my-list" exact={true} activeClassName="isActive" >
                        <Button className='w-full !text-left !py-2 !px-5 !justify-start !capitalise !text-[rgba(0,0,0,0.8)] !rounded-none flex items-center gap-2'>
                            <IoIosListBox className='text-[18px]' />
                            My List
                        </Button>
                    </NavLink>
                </li>
                <li className='w-full'>
                    <NavLink to="/my-orders" exact={true} activeClassName="isActive" >
                        <Button className='w-full !text-left !py-2 !px-5 !justify-start !capitalise !text-[rgba(0,0,0,0.8)] !rounded-none flex items-center gap-2'>
                            <BsBoxFill className='text-[18px]' />
                            My Orders
                        </Button>
                    </NavLink>
                </li>
                <li className='w-full'>
                    <NavLink to="/logout" exact={true} activeClassName="isActive" >
                        <Button className='w-full !text-left !py-2 !px-5 !justify-start !capitalise !text-[rgba(0,0,0,0.8)] !rounded-none flex items-center gap-2'>
                            <IoLogOut className='text-[18px]' />
                            Logout
                        </Button>
                    </NavLink>
                </li>
            </ul>
        </div>
    )
}

export default AccountSidebar