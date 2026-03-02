import Button from '@mui/material/Button'
import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { IoHomeOutline } from "react-icons/io5";
import { LuUsersRound } from "react-icons/lu";
import { TbCategoryPlus } from "react-icons/tb";
import { IoCartOutline } from "react-icons/io5";
import { GiBoxUnpacking } from "react-icons/gi";
import { IoIosLogOut } from "react-icons/io";
import { FaAngleDown } from "react-icons/fa6";
import { Collapse } from 'react-collapse';
import { MyContext } from '../../App';

const Sidebar = () => {
    const [subMenuIndex, setSubMenuIndex] = useState(null);

    const isOpenSubMenu = (index) => {
        if (subMenuIndex === index) {
            setSubMenuIndex(null)
        } else {
            setSubMenuIndex(index)
        }
    }


    const context = useContext(MyContext);

    return (
        <>
            <div className={`sidebar !fixed !top-0 !left-0 !z-[50] !bg-white h-full 
    !border-r !border-[rgba(0,0,0,0.1)] !py-1 !px-5 sidebarWrapper w-[${context.isSidebarOpen === true ? '18%' : '0px'}]`}>
                <div className='!py-2 w-full'>
                    <Link to="/">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/e/ed/ECOM-logo-RGB.png"
                            className='w-[120px] ' />
                    </Link>
                </div>



                <ul className='!mt-3'>
                    <li>
                        <Link to="/">
                            <Button className='w-full !capitalise !justify-start 
                        flex gap-3 text-[14px] !font-[500] !text-[rgba(0,0,0,0.8)] items-center !py-2 !hover:bg-[#f1f1f1]'>
                                <MdOutlineSpaceDashboard className='text-[20px] ' />
                                <span>Dashboard</span>
                            </Button>
                        </Link>
                    </li>

                    <li>
                        <Link to="/">
                            <Button className='w-full !capitalise !justify-start 
                        flex gap-3 text-[14px] !font-[500] !text-[rgba(0,0,0,0.8)] items-center !py-2 !hover:bg-[#f1f1f1]' onClick={() => isOpenSubMenu(1)}>
                                <IoHomeOutline className='text-[20px] ' />
                                <span>Home Slides</span>
                                <span className='!ml-auto !w-[30px] !h-[30px] flex items-center justfy-center'
                                >
                                    <FaAngleDown className={`transition-all ${subMenuIndex === 1 ? 'rotate-180' : ''}`} />
                                </span>
                            </Button>
                        </Link>

                        <Collapse isOpened={subMenuIndex === 1 ? true : false}>
                            <ul className='w-full'>
                                <li className='w-full'>
                                    <Link to="homeSlider/List">
                                        <Button className='!text-[rgba(0,0,0,0.7)] !capitalise !pl-8 !justify-start !w-full !text-[13px] !font-[500] gap-3'>
                                            <span className='block w-[5px] h-[5px] rounded-full !bg-[rgba(0,0,0,0.2)]'></span>Home Banner List
                                        </Button>
                                    </Link>
                                    <Button className='!text-[rgba(0,0,0,0.7)] !capitalise !pl-8 !justify-start !w-full !text-[13px] !font-[500] gap-3'
                                        onClick={() => context.setIsOpenFullScreenPanel({
                                            open: true,
                                            model: 'Add Home Slide'
                                        })}>
                                        <span className='block w-[5px] h-[5px] rounded-full !bg-[rgba(0,0,0,0.2)]'></span>Add Home Banner Slide
                                    </Button>
                                </li>
                            </ul>
                        </Collapse>

                    </li>

                    <li>
                        <Link to="/users">
                            <Button className='w-full !capitalise !justify-start 
                        flex gap-3 text-[14px] !font-[500] !text-[rgba(0,0,0,0.8)] items-center !py-2 !hover:bg-[#f1f1f1]'>
                                <LuUsersRound className='text-[20px] ' />
                                <span>Users</span>
                            </Button>
                        </Link>
                    </li>

                    <li>
                        <Link to="/">
                            <Button className='w-full !capitalise !justify-start 
                        flex gap-3 text-[14px] !font-[500] !text-[rgba(0,0,0,0.8)] items-center !py-2 !hover:bg-[#f1f1f1]' onClick={() => isOpenSubMenu(3)}>
                                <TbCategoryPlus className='text-[20px] ' />
                                <span>Category</span>
                                <span className='!ml-auto !w-[30px] !h-[30px] flex items-center justfy-center'
                                >
                                    <FaAngleDown className={`transition-all ${subMenuIndex === 3 ? 'rotate-180' : ''}`} />
                                </span>
                            </Button>
                        </Link>

                        <Collapse isOpened={subMenuIndex === 3 ? true : false}>
                            <ul className='w-full'>
                                <li className='w-full'>
                                    <Link to="/category/list">
                                        <Button className='!text-[rgba(0,0,0,0.7)] !capitalise !pl-8 !justify-start !w-full !text-[13px] !font-[500] gap-3'>
                                            <span className='block w-[5px] h-[5px] rounded-full !bg-[rgba(0,0,0,0.2)]'></span>Category List
                                        </Button>
                                    </Link>
                                    <Button className='!text-[rgba(0,0,0,0.7)] !capitalise !pl-8 !justify-start !w-full !text-[13px] !font-[500] gap-3'
                                        onClick={() => context.setIsOpenFullScreenPanel({
                                            open: true,
                                            model: 'Add New Category'
                                        })}>
                                        <span className='block w-[5px] h-[5px] rounded-full !bg-[rgba(0,0,0,0.2)]'></span>Add a Category
                                    </Button>
                                    <Link to="/subCategory/list">
                                        <Button className='!text-[rgba(0,0,0,0.7)] !capitalise !pl-8 !justify-start !w-full !text-[13px] !font-[500] gap-3'>
                                            <span className='block w-[5px] h-[5px] rounded-full !bg-[rgba(0,0,0,0.2)]'></span>Sub Category List
                                        </Button>
                                    </Link>
                                    <Button className='!text-[rgba(0,0,0,0.7)] !capitalise !pl-8 !justify-start !w-full !text-[13px] !font-[500] gap-3'
                                        onClick={() => context.setIsOpenFullScreenPanel({
                                            open: true,
                                            model: 'Add New Sub Category'
                                        })}>
                                        <span className='block w-[5px] h-[5px] rounded-full !bg-[rgba(0,0,0,0.2)]'></span>Add a sub category
                                    </Button>
                                </li>
                            </ul>
                        </Collapse>

                    </li>

                    <li>
                        <Link to="/">
                            <Button className='w-full !capitalise !justify-start 
                        flex gap-3 text-[14px] !font-[500] !text-[rgba(0,0,0,0.8)] items-center !py-2 !hover:bg-[#f1f1f1]' onClick={() => isOpenSubMenu(4)}>
                                <IoCartOutline className='text-[20px] ' />
                                <span>Products</span>
                                <span className='!ml-auto !w-[30px] !h-[30px] flex items-center justfy-center'
                                >
                                    <FaAngleDown className={`transition-all ${subMenuIndex === 4 ? 'rotate-180' : ''}`} />
                                </span>
                            </Button>
                        </Link>

                        <Collapse isOpened={subMenuIndex === 4 ? true : false}>
                            <ul className='w-full'>
                                <li className='w-full'>
                                    <Link to="/products">
                                        <Button className='!text-[rgba(0,0,0,0.7)] !capitalise !pl-8 !justify-start !w-full !text-[13px] !font-[500] gap-3'>
                                            <span className='block w-[5px] h-[5px] rounded-full !bg-[rgba(0,0,0,0.2)]'></span>Product List
                                        </Button>
                                    </Link>
                                    <Button className='!text-[rgba(0,0,0,0.7)] !capitalise !pl-8 !justify-start !w-full !text-[13px] !font-[500] gap-3'
                                        onClick={() => context.setIsOpenFullScreenPanel({
                                            open: true,
                                            model: 'Add Product'
                                        })}>
                                        <span className='block w-[5px] h-[5px] rounded-full !bg-[rgba(0,0,0,0.2)]'></span>Product Upload
                                    </Button>


                                </li>


                                <li className='w-full'>
                                    <Link to="/products/addRAMS">
                                        <Button className='!text-[rgba(0,0,0,0.7)] !capitalise !pl-8 !justify-start !w-full !text-[13px] !font-[500] gap-3'>
                                            <span className='block w-[5px] h-[5px] rounded-full !bg-[rgba(0,0,0,0.2)]'></span>Add Product RAM
                                        </Button>
                                    </Link>
                                </li> 
                            </ul>
                        </Collapse>

                    </li>

                    <li>
                        <Link to="/orders">
                            <Button className='w-full !capitalise !justify-start 
                        flex gap-3 text-[14px] !font-[500] !text-[rgba(0,0,0,0.8)] items-center !py-2 !hover:bg-[#f1f1f1]'>
                                <GiBoxUnpacking className='text-[20px] ' />
                                <span>Orders</span>
                            </Button>
                        </Link>
                    </li>

                    <li>
                        <Link to="/">
                            <Button className='w-full !capitalise !justify-start 
                        flex gap-3 text-[14px] !font-[500] !text-[rgba(0,0,0,0.8)] items-center !py-2 !hover:bg-[#f1f1f1]'>
                                <IoIosLogOut className='text-[20px] ' />
                                <span>Logout</span>
                            </Button>
                        </Link>
                    </li>

                </ul>
            </div>
        </>
    )
}

export default Sidebar