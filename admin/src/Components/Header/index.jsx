import React, { useContext, useState } from 'react'
import Button from '@mui/material/Button'
import { RiMenu2Line } from 'react-icons/ri'
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { FaRegBell } from "react-icons/fa6";
import Box from '@mui/material/Box';
import { RxAvatar } from "react-icons/rx";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { MdOutlineManageAccounts } from "react-icons/md";
import { MdLogout } from "react-icons/md";
import { FiActivity } from "react-icons/fi";
import { MyContext } from '../../App';
import { Link } from 'react-router-dom';
import { fetchDataFromApi } from "../../utils/api.js";

import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { IoMdClose } from 'react-icons/io';
import Slide from '@mui/material/Slide';

import EditCategory from '../../Pages/Category/editCategory.jsx';
import AddAddress from '../../Pages/Address/addAddress.jsx';
import AddSubCategory from '../../Pages/Category/addSubCategory.jsx';
import AddCategory from '../../Pages/Category/addCategory.jsx';
import AddHomeSlide from '../../Pages/HomeSliderBanners/addHomeSlide.jsx';
import AddProduct from '../../Pages/Products/addProduct.jsx';
import EditProduct from '../../Pages/Products/editProduct.jsx';
import AddBannersV1 from '../../Pages/Banners/addBannersV1.jsx';
import EditBannersV1 from '../../Pages/Banners/editBannerV1.jsx';
import AddBlog from '../../Pages/Blog/addBlog.jsx';
import EditBlog from '../../Pages/Blog/EditBlog.jsx';
import AddBannersV2 from '../../Pages/BannersV2/addBannersV2.jsx';
import EditBannersV2 from '../../Pages/BannersV2/editBannerV2.jsx';
import AddAdsBannerV1 from '../../Pages/AdsBannerV1/addAdsBannerV1.jsx';
import AddAdsBannerV2 from '../../Pages/AdsBannerV2/addAdsBannerV2.jsx';
import EditAdsBannerV1 from '../../Pages/AdsBannerV1/editAdsBannerV1.jsx';
import EditAdsBannerV2 from '../../Pages/AdsBannerV2/editAdsBannerV2.jsx';


const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
    padding: '0 4px',
  },
}));

const Transition = React.forwardRef(function Transition(
  props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Header = () => {

  const [anchorMyAcc, setAnchorMyAcc] = useState(null);
  const openMyAcc = Boolean(anchorMyAcc);
  const handleClickMyAcc = (event) => {
    setAnchorMyAcc(event.currentTarget);
  };
  const handleCloseMyAcc = () => {
    setAnchorMyAcc(null);
  };

  const context = useContext(MyContext);

  const logout = () => {
    setAnchorMyAcc(null)
    fetchDataFromApi(`/api/user/logout?token=${localStorage.getItem('accesstoken')}`,
      { withCredentials: true }).then((res) => {
        console.log(res)
        if (res?.error === false) {
          context.setIsLogin(false);
          localStorage.removeItem("accesstoken", res?.data?.accesstoken)
          localStorage.removeItem("refreshToken", res?.data?.refreshToken)
        }
      }
      )
  }

  return (
    <>
      <header className={`w-full !h-[auto] !py-2 ${context.isSidebarOpen === true ? 'pl-66' : 'pl-0'} !shadow-md 
        !pr-7 !bg-[#fff] flex items-center justify-between transition-all fixed !top-0 !left-0 !z-50`}>
        <div className='part1 !pl-6'>
          <Button className='!w-[40px] !h-[40px] !rounded-full !min-w-[40px] !text-[rgba(0,0,0,0.8)] '
            onClick={() => context.setisSidebarOpen(!context.isSidebarOpen)}>
            <RiMenu2Line className='text-[22px] text-[rgba(0,0,0,0.8)] ' />

          </Button>
        </div>


        <div className='part2 w-[40%] flex items-center justify-end !px-6 gap-5 '>
          <IconButton aria-label="cart">
            <StyledBadge badgeContent={4} color="secondary">
              <FaRegBell />
            </StyledBadge>
          </IconButton>


          {
            context.isLogin === true ?
              <div className='relative'>
                <div className='rounded-full w-[35px] h-[35px] overflow-hidden cursor-pointer' onClick={handleClickMyAcc}>
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfE8XWOVe86hLGi8m9mgPTsva_KWjTHbT9iQ&s" className='w-full h-full object-cover' />
                </div>

                <Menu
                  anchorEl={anchorMyAcc}
                  id="account-menu"
                  open={openMyAcc}
                  onClose={handleCloseMyAcc}
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
                  <MenuItem onClick={handleCloseMyAcc} className='!bg-white'>
                    <div className='flex items-center gap-3'>
                      <div className='rounded-full w-[35px] h-[35px] overflow-hidden cursor-pointer' >
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfE8XWOVe86hLGi8m9mgPTsva_KWjTHbT9iQ&s" className='w-full h-full object-cover' />
                      </div>
                    </div>

                    <div className='info px-4'>
                      <h3 className='text-[15px] font-[500] leading-5'>{context?.userData?.name}</h3>
                      <p className='text-[12px] font-[400] opacity-70'>{context?.userData?.email}</p>
                    </div>
                  </MenuItem>
                  <Divider />

                  <Link to="/profile">
                    <MenuItem onClick={handleCloseMyAcc} className='flex items-center gap-3'>
                      <RxAvatar className='text-[25px]' />
                      <span className='text-[22px]'>Profile</span>
                    </MenuItem>
                  </Link>
                  <MenuItem onClick={handleCloseMyAcc} className='flex items-center gap-3'>
                    <MdOutlineManageAccounts className='text-[25px]' />
                    <span className='text-[22px]'>Account Setting</span>
                  </MenuItem>

                  <MenuItem onClick={handleCloseMyAcc} className='flex items-center gap-3'>
                    <FiActivity className='text-[25px]' />
                    <span className='text-[22px]'>Activity Log</span>
                  </MenuItem>
                  <Divider />
                  <MenuItem
                    onClick={logout}
                    className='flex items-center gap-3'>
                    <MdLogout className='text-[25px]' />
                    <span className='text-[22px]'>Sign Out</span>
                  </MenuItem>
                </Menu>
              </div>


              :

              <Link to='/login' >
                <Button className='btn-blue btn-sm !rounded-full'>Sign In</Button>
              </Link>
          }



        </div>
      </header>



      <Dialog
        fullScreen
        open={context?.isOpenFullScreenPanel.open}
        onClose={() => context?.setIsOpenFullScreenPanel({
          open: false
        })}
        slots={{
          transition: Transition,
        }}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => context?.setIsOpenFullScreenPanel({
                open: false
              })}
              aria-label="close"
            >
              <IoMdClose className='!text-gray-800' />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              <span className='text-gray-800'>{context?.isOpenFullScreenPanel?.model}</span>
            </Typography>
          </Toolbar>
        </AppBar>


        {
          context?.isOpenFullScreenPanel?.model === "Add Product" && <AddProduct />
        }

        {
          context?.isOpenFullScreenPanel?.model === "Add Home Slide" && <AddHomeSlide />
        }

        {
          context?.isOpenFullScreenPanel?.model === "Add New Category" && <AddCategory />
        }

        {
          context?.isOpenFullScreenPanel?.model === "Add New Sub Category" && <AddSubCategory />
        }

        {
          context?.isOpenFullScreenPanel?.model === "Add New Address" && <AddAddress />
        }

        {
          context?.isOpenFullScreenPanel?.model === "Edit Category" && <EditCategory />
        }

        {
          context?.isOpenFullScreenPanel?.model === "Edit Product" && <EditProduct />
        }

        {
          context?.isOpenFullScreenPanel?.model === "Add Banners V1" && <AddBannersV1 />
        }

        {
          context?.isOpenFullScreenPanel?.model === "Edit Banner V1" && <EditBannersV1 />
        }

        {
          context?.isOpenFullScreenPanel?.model === "Add Banners V2" && <AddBannersV2 />
        }

        {
          context?.isOpenFullScreenPanel?.model === "Edit Banner V2" && <EditBannersV2 />
        }

        {
          context?.isOpenFullScreenPanel?.model === "Add Blog" && <AddBlog />
        }

        {
          context?.isOpenFullScreenPanel?.model === "Edit Blog" && <EditBlog />
        }
        {
          context?.isOpenFullScreenPanel?.model === "Add Ads Banner V1" && <AddAdsBannerV1 />
        }
        {
          context?.isOpenFullScreenPanel?.model === "Add Ads Banner V2" && <AddAdsBannerV2 />
        }
        {
          context?.isOpenFullScreenPanel?.model === "Edit Ads Banner V1" && <EditAdsBannerV1 />
        }
        {
          context?.isOpenFullScreenPanel?.model === "Edit Ads Banner V2" && <EditAdsBannerV2 />
        }
      </Dialog>
    </>
  )
}

export default Header