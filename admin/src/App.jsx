import { useState } from 'react'
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
//import "../../index.css";
import './App.css';
import Dashboard from './Pages/Dashboard'
import Header from './Components/Header'
import Sidebar from './Components/Sidebar';
import { createContext } from 'react';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';
import Products from './Pages/Products';
import AddProduct from './Pages/Products/addProduct';


import HomeSliderBanners from './Pages/HomeSliderBanners';
import AddHomeSlide from './Pages/HomeSliderBanners/addHomeSlide';
import CategoryList from './Pages/Category';
import AddCategory from './Pages/Category/addCategory';
import SubCategoryList from './Pages/Category/subCatList';
import AddSubCategory from './Pages/Category/addSubCategory';
import Users from './Pages/Users';
import Orders from './Pages/Orders';
import ForgotPassword from './Pages/ForgotPassword';
import VerifyAccount from './Pages/VerifyAccount';
import ChangePassword from './Pages/ChangePassword';
import { fetchDataFromApi } from "./utils/api.js";
import toast, { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import Profile from './Pages/Profile/index.jsx';
import AddAddress from './Pages/Address/addAddress.jsx';
import EditCategory from './Pages/Category/editCategory.jsx';
import ProductDetails from './Pages/Products/productDetails.jsx';
import AddRAMS from './Pages/Products/addRAM.jsx';
import AddWEIGHT from './Pages/Products/addWEIGHT.jsx';
import AddSIZE from './Pages/Products/addSIZE.jsx';
import BannerV1List from './Pages/Banners/bannerV1list.jsx';
import BlogList from './Pages/Blog/index.jsx';
import BannerV2List from './Pages/BannersV2/bannerV2list.jsx';
import AdsBannerV1List from './Pages/AdsBannerV1/index.jsx';
import AdsBannerV2List from './Pages/AdsBannerV2/index.jsx';


const alertBox = (type, msg) => {
  if (type === "success") {
    toast.success(msg);
  }
  if (type === "error") {
    toast.error(msg);
  }
};





const MyContext = createContext();
function App() {
  const [isSidebarOpen, setisSidebarOpen] = useState(true)
  const [isLogin, setIsLogin] = useState(false)
  const [userData, setUserData] = useState(null)
  const [address, setAddress] = useState([])
  const [catData, setCatData] = useState([])
  const [isOpenFullScreenPanel, setIsOpenFullScreenPanel] = useState({
    open: false,
    model: '',
    id: ""
  })


  useEffect(() => {
    const token = localStorage.getItem('accesstoken')
    if (token !== undefined && token !== null && token !== "") {
      setIsLogin(true)


      fetchDataFromApi(`/api/user/user-details`).then((res) => {
        // console.log("===== I am here ---- 1", res.status)
        //console.log(res)
        setUserData(res.data)
        if (res?.status !== 200) {
          localStorage.removeItem("accesstoken")
          localStorage.removeItem("refreshToken")

          alertBox("error", "Your session is closed please login again")
          window.location.href = "/login"
        }
      })
    }
    else {
      setIsLogin(false)
    }
  }, [isLogin])

 

  const getCat = () => {
    fetchDataFromApi("/api/category/").then((res) => {
      //console.log(res?.data)
      setCatData(res?.data)
    })
  }

  useEffect(() => {
    getCat()
  }, [])

  const router = createBrowserRouter([

    //home router
    {
      path: '/',
      exact: true,
      element: (
        <>
          <section className='main'>
            <Header />
            <div className='contentMain flex'>
              <div className={`overflow-hidden sidebarWrapper ${isSidebarOpen === true ? 'w-[18%]' : 'w-[0px] opacity-0 transition-all'}`}>
                <Sidebar />
              </div>
              <div className={`contentRight !py-4 !pt-20 !px-5 ${isSidebarOpen === true ? 'w-[82%]' : 'w-[100%]'} transition-all`}>
                <Dashboard />
              </div>
            </div>
          </section>
        </>
      )
    },


    //login router
    {
      path: '/login',
      exact: true,
      element: (
        <>
          <Login />
        </>
      )
    },


    //sign-up router
    {
      path: '/sign-up',
      exact: true,
      element: (
        <>
          <SignUp />
        </>
      )
    },

    //forgot-password router
    {
      path: '/forgot-password',
      exact: true,
      element: (
        <>
          <ForgotPassword />
        </>
      )
    },


    //verify-account router
    {
      path: '/verify-account',
      exact: true,
      element: (
        <>
          <VerifyAccount />
        </>
      )
    },


    //change password router
    {
      path: '/change-password',
      exact: true,
      element: (
        <>
          <ChangePassword />
        </>
      )
    },

    // products router
    {
      path: '/products',
      exact: true,
      element: (
        <>
          <section className='main'>
            <Header />
            <div className='contentMain flex'>
              <div className={`overflow-hidden sidebarWrapper ${isSidebarOpen === true ? 'w-[18%]' : 'w-[0px] opacity-0 transition-all'}`}>
                <Sidebar />
              </div>
              <div className={`contentRight !py-4  !mt-15 !px-5 ${isSidebarOpen === true ? 'w-[82%]' : 'w-[100%]'} transition-all`}>
                <Products />
              </div>
            </div>
          </section>
        </>
      )
    },

    {
      path: '/homeSlider/list',
      exact: true,
      element: (
        <>
          <section className='main'>
            <Header />
            <div className='contentMain flex'>
              <div className={`overflow-hidden sidebarWrapper ${isSidebarOpen === true ? 'w-[18%]' : 'w-[0px] opacity-0 transition-all'}`}>
                <Sidebar />
              </div>
              <div className={`contentRight !py-4  !mt-15 !px-5 ${isSidebarOpen === true ? 'w-[82%]' : 'w-[100%]'} transition-all`}>
                <HomeSliderBanners />
              </div>
            </div>
          </section>
        </>
      )
    },

    {
      path: '/category/list',
      exact: true,
      element: (
        <>
          <section className='main'>
            <Header />
            <div className='contentMain flex'>
              <div className={`overflow-hidden sidebarWrapper ${isSidebarOpen === true ? 'w-[18%]' : 'w-[0px] opacity-0 transition-all'}`}>
                <Sidebar />
              </div>
              <div className={`contentRight !py-4 !mt-15 !px-5 ${isSidebarOpen === true ? 'w-[82%]' : 'w-[100%]'} transition-all`}>
                <CategoryList />
              </div>
            </div>
          </section>
        </>
      )
    },

    {
      path: '/subCategory/list',
      exact: true,
      element: (
        <>
          <section className='main'>
            <Header />
            <div className='contentMain flex'>
              <div className={`overflow-hidden sidebarWrapper ${isSidebarOpen === true ? 'w-[18%]' : 'w-[0px] opacity-0 transition-all'}`}>
                <Sidebar />
              </div>
              <div className={`contentRight !py-4 !mt-15 !px-5 ${isSidebarOpen === true ? 'w-[82%]' : 'w-[100%]'} transition-all`}>
                <SubCategoryList />
              </div>
            </div>
          </section>
        </>
      )
    },

    {
      path: '/users',
      exact: true,
      element: (
        <>
          <section className='main'>
            <Header />
            <div className='contentMain flex'>
              <div className={`overflow-hidden sidebarWrapper ${isSidebarOpen === true ? 'w-[18%]' : 'w-[0px] opacity-0 transition-all'}`}>
                <Sidebar />
              </div>
              <div className={`contentRight !py-4 !mt-15 !px-5 ${isSidebarOpen === true ? 'w-[82%]' : 'w-[100%]'} transition-all`}>
                <Users />
              </div>
            </div>
          </section>
        </>
      )
    },

    {
      path: '/orders',
      exact: true,
      element: (
        <>
          <section className='main'>
            <Header />
            <div className='contentMain flex'>
              <div className={`overflow-hidden sidebarWrapper ${isSidebarOpen === true ? 'w-[18%]' : 'w-[0px] opacity-0 transition-all'}`}>
                <Sidebar />
              </div>
              <div className={`contentRight !py-4 !mt-15 !px-5 ${isSidebarOpen === true ? 'w-[82%]' : 'w-[100%]'} transition-all`}>
                <Orders />
              </div>
            </div>
          </section>
        </>
      )
    },


    {
      path: '/profile',
      exact: true,
      element: (
        <>
          <section className='main'>
            <Header />
            <div className='contentMain flex'>
              <div className={`overflow-hidden sidebarWrapper ${isSidebarOpen === true ? 'w-[18%]' : 'w-[0px] opacity-0 transition-all'}`}>
                <Sidebar />
              </div>
              <div className={`contentRight !py-4 !px-5 ${isSidebarOpen === true ? 'w-[82%]' : 'w-[100%]'} transition-all`}>
                <Profile />
              </div>
            </div>
          </section>
        </>
      )
    },

    {
      path: '/products/:id',
      exact: true,
      element: (
        <>
          <section className='main'>
            <Header />
            <div className='contentMain flex'>
              <div className={`overflow-hidden sidebarWrapper ${isSidebarOpen === true ? 'w-[18%]' : 'w-[0px] opacity-0 transition-all'}`}>
                <Sidebar />
              </div>
              <div className={`contentRight !py-4 !px-5 ${isSidebarOpen === true ? 'w-[82%]' : 'w-[100%]'} transition-all`}>
                <ProductDetails />
              </div>
            </div>
          </section>
        </>
      )
    },

    //Product Ram route
    {
      path: '/products/addRAMS',
      exact: true,
      element: (
        <>
          <section className='main'>
            <Header />
            <div className='contentMain flex'>
              <div className={`overflow-hidden sidebarWrapper ${isSidebarOpen === true ? 'w-[18%]' : 'w-[0px] opacity-0 transition-all'}`}>
                <Sidebar />
              </div>
              <div className={`contentRight !py-4 !mt-15 !px-5 ${isSidebarOpen === true ? 'w-[82%]' : 'w-[100%]'} transition-all`}>
                <AddRAMS />
              </div>
            </div>
          </section>
        </>
      )
    },

    //Product Weight route
    {
      path: '/products/addWeight',
      exact: true,
      element: (
        <>
          <section className='main'>
            <Header />
            <div className='contentMain flex'>
              <div className={`overflow-hidden sidebarWrapper ${isSidebarOpen === true ? 'w-[18%]' : 'w-[0px] opacity-0 transition-all'}`}>
                <Sidebar />
              </div>
              <div className={`contentRight !py-4 !mt-15 !px-5 ${isSidebarOpen === true ? 'w-[82%]' : 'w-[100%]'} transition-all`}>
                <AddWEIGHT />
              </div>
            </div>
          </section>
        </>
      )
    },

    //Product Size route
    {
      path: '/products/addSize',
      exact: true,
      element: (
        <>
          <section className='main'>
            <Header />
            <div className='contentMain flex'>
              <div className={`overflow-hidden sidebarWrapper ${isSidebarOpen === true ? 'w-[18%]' : 'w-[0px] opacity-0 transition-all'}`}>
                <Sidebar />
              </div>
              <div className={`contentRight !py-4 !mt-15 !px-5 ${isSidebarOpen === true ? 'w-[82%]' : 'w-[100%]'} transition-all`}>
                <AddSIZE />
              </div>
            </div>
          </section>
        </>
      )
    },
    {
      path: '/bannerV1/List',
      exact: true,
      element: (
        <>
          <section className='main'>
            <Header />
            <div className='contentMain flex'>
              <div className={`overflow-hidden sidebarWrapper ${isSidebarOpen === true ? 'w-[18%]' : 'w-[0px] opacity-0 transition-all'}`}>
                <Sidebar />
              </div>
              <div className={`contentRight !py-4 !mt-15 !px-5 ${isSidebarOpen === true ? 'w-[82%]' : 'w-[100%]'} transition-all`}>
                <BannerV1List />
              </div>
            </div>
          </section>
        </>
      )
    },
    {
      path: '/bannerV2/List',
      exact: true,
      element: (
        <>
          <section className='main'>
            <Header />
            <div className='contentMain flex'>
              <div className={`overflow-hidden sidebarWrapper ${isSidebarOpen === true ? 'w-[18%]' : 'w-[0px] opacity-0 transition-all'}`}>
                <Sidebar />
              </div>
              <div className={`contentRight !py-4 !mt-15 !px-5 ${isSidebarOpen === true ? 'w-[82%]' : 'w-[100%]'} transition-all`}>
                <BannerV2List />
              </div>
            </div>
          </section>
        </>
      )
    },
    {
      path: '/adsBannerV1/list',
      exact: true,
      element: (
        <>
          <section className='main'>
            <Header />
            <div className='contentMain flex'>
              <div className={`overflow-hidden sidebarWrapper ${isSidebarOpen === true ? 'w-[18%]' : 'w-[0px] opacity-0 transition-all'}`}>
                <Sidebar />
              </div>
              <div className={`contentRight !py-4 !mt-15 !px-5 ${isSidebarOpen === true ? 'w-[82%]' : 'w-[100%]'} transition-all`}>
                <AdsBannerV1List />
              </div>
            </div>
          </section>
        </>
      )
    },
    {
      path: '/adsBannerV2/list',
      exact: true,
      element: (
        <>
          <section className='main'>
            <Header />
            <div className='contentMain flex'>
              <div className={`overflow-hidden sidebarWrapper ${isSidebarOpen === true ? 'w-[18%]' : 'w-[0px] opacity-0 transition-all'}`}>
                <Sidebar />
              </div>
              <div className={`contentRight !py-4 !mt-15 !px-5 ${isSidebarOpen === true ? 'w-[82%]' : 'w-[100%]'} transition-all`}>
                <AdsBannerV2List />
              </div>
            </div>
          </section>
        </>
      )
    },
    {
      path: '/blog/List',
      exact: true,
      element: (
        <>
          <section className='main'>
            <Header />
            <div className='contentMain flex'>
              <div className={`overflow-hidden sidebarWrapper ${isSidebarOpen === true ? 'w-[18%]' : 'w-[0px] opacity-0 transition-all'}`}>
                <Sidebar />
              </div>
              <div className={`contentRight !py-4 !mt-15 !px-5 ${isSidebarOpen === true ? 'w-[82%]' : 'w-[100%]'} transition-all`}>
                <BlogList />
              </div>
            </div>
          </section>
        </>
      )
    }

  ])


  const values = {
    isSidebarOpen,
    setisSidebarOpen,
    isLogin,
    setIsLogin,
    isOpenFullScreenPanel,
    setIsOpenFullScreenPanel,
    alertBox,
    userData,
    setUserData,
    setAddress,
    address,
    catData,
    setCatData,
    getCat
  };


  return (
    <>
      <MyContext.Provider value={values}>
        <RouterProvider router={router} />
        <Toaster />
        
      </MyContext.Provider>
    </>
  )
}

export default App;
export { MyContext }
