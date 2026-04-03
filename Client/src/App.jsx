import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './index.css'
import './responsive.css'
import Header from './components/Header/index.jsx';
import Footer from './components/Footer/index.jsx';
import Home from './Pages/Home';
import ProductListing from './Pages/ProductListing';
import ProductDetails from './Pages/ProductDetails';
import { createContext } from 'react';
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import CartPage from "./Pages/Cart";
import Verify from "./Pages/Verify";
import ForgotPassword from "./Pages/ForgotPassword/index.jsx";
import toast, { Toaster } from 'react-hot-toast';
import Checkout from "./Pages/Checkout";
import MyAccount from "./Pages/MyAccount/index.jsx";
import MyList from "./Pages/MyList/index.jsx";
import Orders from "./Pages/Orders";
import { fetchDataFromApi, postData, editData } from "./utils/api.js";
import Address from "./Pages/MyAccount/address.jsx";
import OrderSuccess from "./Pages/Orders/success.jsx";
import OrderFailed from "./Pages/Orders/failed.jsx";
import { PayPalScriptProvider } from "@paypal/react-paypal-js"
import SearchPage from "./Pages/Search/index.jsx";
import CompareModal from "./components/CompareModal";

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

  const [openProductDetailsModal, setOpenProductDetailsModal] = useState({
    open: false,
    item: {}
  });
  const [maxWidth] = React.useState('lg');
  const [fullWidth] = React.useState(true)
  const [openCartPanel, setOpenCartPanel] = useState(false);
  const [openAddressPanel, setOpenAddressPanel] = useState(false);
  const [isLogin, setIsLogin] = useState(() => {
    const token = localStorage.getItem('accesstoken');
    return token !== undefined && token !== null && token !== "";
  })
  const [userData, setUserData] = useState(null)
  const apiUrl = import.meta.env.VITE_API_URL;
  const [cartData, setCartData] = useState([]);
  const [myListData, setMyListData] = useState([]);
  const [catData, setCatData] = useState([]);
  const [address, setAddress] = useState([]);
  const [editId, setEditId] = useState(null);
  const [searchData, setSearchData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [compareData, setCompareData] = useState([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const addToCompare = (product) => {
    const isDuplicate = compareData.some(item => item._id === product._id);
    if (isDuplicate) {
      alertBox("error", "Product is already added to compare!");
      return;
    }
    if (compareData.length > 0 && compareData[0].catId !== product.catId) {
      alertBox("error", "You can only compare products from the same category!");
      return;
    }
    if (compareData.length >= 3) {
      alertBox("error", "You can only compare up to 3 products!");
      return;
    }
    setCompareData([...compareData, product]);
    setIsCompareModalOpen(true);
  };

  const removeCompareItem = (id) => {
    setCompareData(compareData.filter(item => item._id !== id));
  };

  const handleOpenProductDetailsModal = (status, item) => {
    setOpenProductDetailsModal({
      open: status,
      item: item
    });
  };

  const handleCloseProductDetailsModal = () => {
    setOpenProductDetailsModal({
      open: false,
      item: {}
    });
  };

  const toggleCartPanel = (newOpen) => {
    setOpenCartPanel(newOpen);
  };

  const toggleAddressPanel = (newOpen) => {
    setOpenAddressPanel(newOpen);
  };

  useEffect(() => {
    const token = localStorage.getItem('accesstoken')
    if (isLogin === true && token !== undefined && token !== null && token !== "") {
      fetchDataFromApi(`/api/user/user-details`).then((res) => {
        if (res?.status === 200) {
          setUserData(res.data)
        } else {
          localStorage.removeItem("accesstoken")
          localStorage.removeItem("refreshToken")
          setIsLogin(false)
          setUserData(null)
          alertBox("error", "Your session is closed please login again")
          window.location.href = "/login"
        }
      })

      getCartItems();
      getMyListData();
    } else {
      setUserData(null);
    }
  }, [isLogin])

  useEffect(() => {
    fetchDataFromApi("/api/category").then((res) => {
      if (res?.error === false) {
        setCatData(res?.data)
      }
    })

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [])


  const addToCart = async (product, userId, quantity, variations = {}) => {
    if (userId === undefined) {
      alertBox("error", "Please login to add product to cart");
      return false;
    }

    const data = {
      productTitle: product?.name,
      image: product?.images[0],
      price: product?.price,
      oldPrice: product?.oldPrice,
      discount: product?.discount,
      rating: product?.rating,
      quantity: quantity,
      subTotal: parseInt(product?.price * quantity),
      productId: product?._id,
      countInStock: product?.countInStock,
      userId: userId,
      size: variations?.productSize || "",
      weight: variations?.productWeight || "",
      ram: variations?.productRam || "",
      brand: product?.brand,
    }



    postData("/api/cart/add", data).then((res) => {
      if (res?.error === false) {
        alertBox("success", res?.message);

        getCartItems();
      }
      else {
        alertBox("error", res?.message);
      }
    })
  }

  const getCartItems = () => {
    fetchDataFromApi(`/api/cart/get/`).then((res) => {
      if (res?.error === false) {
        setCartData(res?.data)
      }
    })
  }

  const updateCartItem = (id, data) => {
    editData(`/api/cart/update`, { ...data, _id: id }).then((res) => {
      if (res?.error === false) {
        getCartItems();
      } else {
        alertBox("error", res?.message);
      }
    })
  }

  const getMyListData = () => {
    fetchDataFromApi(`/api/myList/`).then((res) => {
      if (res?.error === false) {
        setMyListData(res?.data)
      }
    })
  }

  const getAddresses = () => {
    if (userData?._id !== "" && userData?._id !== undefined) {
      fetchDataFromApi(`/api/address/get?userId=${userData?._id}`).then((res) => {
        setAddress(res.address)
      })
    }
  }

  useEffect(() => {
    if (userData?._id !== null) {
      getAddresses();
    }
  }, [userData])

  const values = {
    handleOpenProductDetailsModal,
    setOpenProductDetailsModal,
    openProductDetailsModal,
    handleCloseProductDetailsModal,
    fullWidth,
    maxWidth,
    setOpenCartPanel,
    toggleCartPanel,
    openCartPanel,
    isLogin,
    setIsLogin,
    alertBox,
    userData,
    setUserData,
    setCatData,
    catData,
    addToCart,
    getCartItems,
    updateCartItem,
    cartData,
    setCartData,
    myListData,
    setMyListData,
    getMyListData,
    toggleAddressPanel,
    openAddressPanel,
    setOpenAddressPanel,
    address,
    setAddress,
    getAddresses,
    editId,
    setEditId,
    searchData,
    setSearchData,
    searchQuery,
    setSearchQuery,
    windowWidth,
    setWindowWidth,
    compareData,
    setCompareData,
    isCompareModalOpen,
    setIsCompareModalOpen,
    addToCompare,
    removeCompareItem
  }

  return (
    <>
      <PayPalScriptProvider options={{
        "client-id": import.meta.env.VITE_APP_PAYPAL_CLIENT_ID,
        currency: "USD",
        intent: "capture",
        "buyer-country": "US"
      }}>
        <BrowserRouter>
          <MyContext.Provider value={values}>
            <Header />
            <Routes>
              {isLogin &&
                <>
                  <Route path={'/'} exact={true} element={<Home />} />
                  <Route path={'/products'} exact={true} element={<ProductListing />} />
                  <Route path={'/product/:id'} exact={true} element={<ProductDetails />} />
                  <Route path={'/login'} exact={true} element={<Login />} />
                  <Route path={'/register'} exact={true} element={<Register />} />
                  <Route path={'/cart'} exact={true} element={<CartPage />} />
                  <Route path={'/verify'} exact={true} element={<Verify />} />
                  <Route path={'/forgot-password'} exact={true} element={<ForgotPassword />} />
                  <Route path={'/checkout'} exact={true} element={<Checkout />} />
                  <Route path={'/my-account'} exact={true} element={<MyAccount />} />
                  <Route path={'/my-list'} exact={true} element={<MyList />} />
                  <Route path={'/my-orders'} exact={true} element={<Orders />} />
                  <Route path={'/orders/success'} exact={true} element={<OrderSuccess />} />
                  <Route path={'/orders/failed'} exact={true} element={<OrderFailed />} />
                  <Route path={'/address'} exact={true} element={<Address />} />
                  <Route path={'/search'} exact={true} element={<SearchPage />} />
                </>
              }
              {!isLogin &&
                <>
                  <Route path={'/'} exact={true} element={<Home />} />
                  <Route path={'/products'} exact={true} element={<ProductListing />} />
                  <Route path={'/product/:id'} exact={true} element={<ProductDetails />} />
                  <Route path={'/login'} exact={true} element={<Login />} />
                  <Route path={'/register'} exact={true} element={<Register />} />
                  <Route path={'/cart'} exact={true} element={<CartPage />} />
                  <Route path={'/verify'} exact={true} element={<Verify />} />
                  <Route path={'/forgot-password'} exact={true} element={<ForgotPassword />} />
                  <Route path={'/checkout'} exact={true} element={<Checkout />} />
                  <Route path={'/my-account'} exact={true} element={<Home />} />
                  <Route path={'/search'} exact={true} element={<SearchPage />} />
                </>
              }
            </Routes>
            <Footer />
            <CompareModal />
          </MyContext.Provider>
        </BrowserRouter>
      </PayPalScriptProvider>

      <Toaster />






    </>
  )
}

export default App;

export { MyContext };
