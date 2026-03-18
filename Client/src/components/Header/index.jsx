import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Search from "../Search";
import Navigation from "./Navigation/index.jsx";
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { IoGitCompareOutline } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";
import { Button, Tooltip } from '@mui/material';
import { MyContext } from "../../App.jsx";
import { FaRegUser } from "react-icons/fa";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { FaUserSecret } from "react-icons/fa";
import { IoIosListBox } from "react-icons/io";
import { BsBoxFill } from "react-icons/bs";
import { IoLogOut } from "react-icons/io5";
import { fetchDataFromApi } from "../../utils/api.js";

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        right: -3,
        top: 13,
        border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
        padding: '0 4px',
    },
}));




const Header = () => {

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);


    const context = useContext(MyContext)
    const history = useNavigate()
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };


    const logout = () => {
        setAnchorEl(null)
        fetchDataFromApi(`/api/user/logout?token=${localStorage.getItem('accesstoken')}`,
            { withCredentials: true }).then((res) => {
                if (res?.error === false) {
                    context.setIsLogin(false);
                    localStorage.removeItem("accesstoken")
                    localStorage.removeItem("refreshToken")
                    context.setUserData(null);
                    context.setCartData([]);
                    context.setMyListData([]);
                    history("/")
                }
            }
            )
    }

    return (
        <header className="bg-white relative sticky !-top-[110px] !z-[1000]">
            <div className="top-strip py-2 border-t-[1px] border-grey-250 border-b-[1px] ">
                <div className="container">
                    <div className="flex items-center justify-between">
                        <div className="col1 w-[50%]">
                            <p className="text-[12px] font-[500]">
                                Free Shipping Over $100 & Free Returns
                            </p>
                        </div>

                        <div className="col2 flex items-center justify-end">
                            <ul className="flex items-center gap-4">
                                <li className="list-none">
                                    <Link to="/help-center" className="text-[13px] link font-[500]
                                    transition">Help Center</Link>
                                </li>
                                <li className="list-none">
                                    <Link to="/Track-Your-Order"
                                        className="text-[13px] link font-[500] transition">
                                        Track Your Order
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="header border-b-[1px] border-grey-250 pt-1 ">
                <div className="container flex items-center justify-between py-2 px-4 gap-6 h-16">
                    <div className="col1 w-[25%] ">
                        <Link to="/">
                            <img src="/logo.jpg" alt="Logo" />
                        </Link>
                    </div>
                    <div className="col2 w-[40%] flex items-center justify-center">
                        <Search />
                    </div>

                    <div className="col3 w-[35%] flex items-center justify-end">
                        <ul className="flex items-center justify-end gap-3 w-full">
                            {
                                context.isLogin === false ?
                                    <li className="list-none">
                                        <Link to="/login" className="link transition text-[15px] font-[500]" >Login </Link>
                                        | &nbsp;
                                        <Link to="/register" className="link transition text-[15px] font-[500]">Register</Link>
                                    </li>
                                    : (
                                        <>
                                            <Button className="!text-[#000] myAccountWrap flex items-center gap-3 cursor-pointer !px-7" onClick={handleClick}>
                                                <Button className="!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !bg-[#f1f1f1]">
                                                    <FaRegUser className="!text-[16px] !text-[rgba(0,0,0,0.7)]" />
                                                </Button>


                                                <div className="info flex flex-col ">
                                                    <h4 className="!leading-3 text-[14px]  font-[500] text-left justify-start text-[rgba(0,0,0,0.7)] !capitalize">
                                                        {context?.userData?.name}
                                                    </h4>
                                                    {/* <span className="text-[13px] font-[400] text-left justify-start text-[rgba(0,0,0,0.7)] !lowercase">
                                                        {context?.userData?.email}
                                                    </span> */}
                                                </div>
                                            </Button>
                                            <Menu
                                                anchorEl={anchorEl}
                                                id="account-menu"
                                                open={open}
                                                onClose={handleClose}
                                                onClick={handleClose}
                                                slotProps={{
                                                    paper: {
                                                        elevation: 0,
                                                        sx: {
                                                            overflow: 'visible',
                                                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                                            mt: 1.5,
                                                            '& .MuiAvatar-root': {
                                                                width: 32,
                                                                height: 32,
                                                                ml: -0.5,
                                                                mr: 1,
                                                            },
                                                            '&::before': {
                                                                content: '""',
                                                                display: 'block',
                                                                position: 'absolute',
                                                                top: 0,
                                                                right: 14,
                                                                width: 10,
                                                                height: 10,
                                                                bgcolor: 'background.paper',
                                                                transform: 'translateY(-50%) rotate(45deg)',
                                                                zIndex: 0,
                                                            },
                                                        },
                                                    },
                                                }}
                                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                            >
                                                <Link to="/my-account" className='w-full block'>
                                                    <MenuItem onClick={handleClose} className="flex gap-2 !py-2 ">
                                                        <FaUserSecret className="text-[18px]" />
                                                        <span className="text-[14px]">My Account</span>
                                                    </MenuItem>
                                                </Link>

                                                <Link to="/my-orders" className='w-full block'>
                                                    <MenuItem onClick={handleClose} className="flex gap-2 !py-2">
                                                        <BsBoxFill className="text-[18px]" />
                                                        <span className="text-[14px]">Order</span>
                                                    </MenuItem>
                                                </Link>

                                                <Link to="/my-list" className='w-full block'>
                                                    <MenuItem onClick={handleClose} className="flex gap-2 !py-2">
                                                        <IoIosListBox className="text-[18px]" />
                                                        <span className="text-[14px]">My List</span>
                                                    </MenuItem>
                                                </Link>

                                                <MenuItem
                                                    onClick={logout}
                                                    className="flex gap-2 !py-2">
                                                    <IoLogOut className="text-[18px]" />
                                                    <span className="text-[14px]">Logout</span>
                                                </MenuItem>
                                                <Divider />
                                            </Menu>
                                        </>
                                    )}



                            <li>
                                <Tooltip title="Compare">
                                    <IconButton aria-label="cart">
                                        <StyledBadge badgeContent={4} color="secondary">
                                            <IoGitCompareOutline />
                                        </StyledBadge>
                                    </IconButton>
                                </Tooltip>
                            </li>

                            <li>
                                <Tooltip title="Wishlist">
                                    <Link to="/my-list">
                                        <IconButton aria-label="cart">
                                            <StyledBadge badgeContent={context?.myListData?.length} color="secondary">
                                                <FaRegHeart />
                                            </StyledBadge>
                                        </IconButton>
                                    </Link>
                                </Tooltip>
                            </li>

                            <li>
                                <Tooltip title="Cart">
                                    <IconButton aria-label="cart" onClick={() => context.setOpenCartPanel(true)}>
                                        <StyledBadge badgeContent={context?.cartData?.length} color="secondary">
                                            <ShoppingCartIcon />
                                        </StyledBadge>
                                    </IconButton>
                                </Tooltip>
                            </li>

                        </ul>

                    </div>
                </div>
            </div>

            <Navigation />


        </header>
    );
};

export default Header;
