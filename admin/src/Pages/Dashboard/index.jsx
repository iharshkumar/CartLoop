import React, { useState, PureComponent, useContext, useEffect } from 'react'
import DashboardBoxes from '../../Components/DashboardBoxes'
import { FaPlus } from 'react-icons/fa6';
import { Button, Checkbox } from '@mui/material'
import { FaAngleDown, FaAngleUp } from 'react-icons/fa'
import Badge from '../../components/Badge'
import { Link } from 'react-router-dom';
import { MdOutlineModeEdit } from "react-icons/md";
import { FiEye } from "react-icons/fi";
import { GoTrash } from "react-icons/go";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MyContext } from '../../App';
import { fetchDataFromApi } from '../../utils/api';
import SearchBox from '../../Components/SearchBox';
import CircularProgress from '@mui/material/CircularProgress';
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'
import Rating from '@mui/material/Rating';


//const label = {inputProps : {"aria-label":"Checkbox demo"}};
const columns =
  [
    { id: 'product', label: 'PRODUCT', minWidth: 150 },
    { id: 'category', label: 'CATEGORY', minWidth: 100 },
    { id: 'subcategory', label: 'SUB CATEGORY', minWidth: 100 },
    {
      id: 'price',
      label: 'PRICE',
      minWidth: 100
    },
    {
      id: 'Sale',
      label: 'SALES',
      minWidth: 80,
    },
    {
      id: 'rating',
      label: 'RATING',
      minWidth: 80,
    },
    {
      id: 'action',
      label: 'ACTION',
      minWidth: 120,
    },
  ];

const Dashboard = () => {
  const context = useContext(MyContext);
  const [productCat, setProductCat] = useState('');
  const [productSubCat, setProductSubCat] = useState('')
  const [productThirdLevelCat, setProductThirdLevelCat] = useState('');
  const [productData, setProductData] = useState([])
  const [isOpenOrderedProduct, setIsOpenOrderedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false)
  const [sortedIds, setSortedIds] = useState([])

  const isShowOrderedProduct = (index) => {
    if (isOpenOrderedProduct === index) {
      setIsOpenOrderedProduct(null);

    } else {
      setIsOpenOrderedProduct(index);
    }
  }

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  //const [categoryFilterVal, setcategoryFilterVal] = React.useState('');

  const [chart1Data, setChart1Data] = useState([
    {
      name: 'JAN',
      TotalUsers: 4000,
      TotalSales: 2400,
      amt: 2400,
    },
    {
      name: 'FEB',
      TotalUsers: 3000,
      TotalSales: 1398,
      amt: 2210,
    },
    {
      name: 'MARCH',
      TotalUsers: 2000,
      TotalSales: 9800,
      amt: 2290,
    },
    {
      name: 'APRIL',
      TotalUsers: 2780,
      TotalSales: 3908,
      amt: 2000,
    },
    {
      name: 'MAY',
      TotalUsers: 1890,
      TotalSales: 4800,
      amt: 2181,
    },
    {
      name: 'JUNE',
      TotalUsers: 2390,
      TotalSales: 3800,
      amt: 2500,
    },
    {
      name: 'JULY',
      TotalUsers: 3490,
      TotalSales: 4300,
      amt: 2100,
    },
    {
      name: 'AUG',
      TotalUsers: 1490,
      TotalSales: 6300,
      amt: 2100,
    },
    {
      name: 'SEPT',
      TotalUsers: 7290,
      TotalSales: 3400,
      amt: 2100,
    },
    {
      name: 'OCT',
      TotalUsers: 3490,
      TotalSales: 5300,
      amt: 2100,
    },
    {
      name: 'NOV',
      TotalUsers: 2490,
      TotalSales: 4500,
      amt: 2100,
    },
    {
      name: 'DEC',
      TotalUsers: 3190,
      TotalSales: 7310,
      amt: 2100,
    }
  ]);

  // const handleChangeCatFilter = (event) => {
  //   setcategoryFilterVal(event.target.value);
  // };


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    getProducts();
  }, [context?.isOpenFullScreenPanel])


  const getProducts = async () => {
    setIsLoading(true);
    fetchDataFromApi("/api/product/getAllProducts")
      .then((res) => {
        let productArr = [];
        if (res?.error === false) {
          for (let i = 0; i < res?.data?.length; i++) {
            productArr[i] = res?.data[i];
            productArr[i].checked = false;
          }
          setTimeout(() => {
            setProductData(productArr);
            // console.log(productArr) 
          }, 500);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }



  const handleChangeProductCat = (event) => {
    setProductCat(event.target.value);
    setProductSubCat('');
    setProductThirdLevelCat('');
    setIsLoading(true)
    fetchDataFromApi(`/api/product/getAllProductsByCatId/${event.target.value}`).then((res) => {
      if (res?.error === false) {
        setProductData(res?.data)
      }
    })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleChangeProductSubCat = (event) => {
    setProductSubCat(event.target.value);
    setProductCat('');
    setProductThirdLevelCat('');
    setIsLoading(true)
    fetchDataFromApi(`/api/product/getAllProductsBySubCatId/${event.target.value}`).then((res) => {
      if (res?.error === false) {
        setProductData(res?.data)
      }
    })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleChangeProductThirdLevelCat = (event) => {
    setProductThirdLevelCat(event.target.value);
    setProductSubCat('');
    setProductCat('');
    setIsLoading(true)
    fetchDataFromApi(`/api/product/getAllProductsByThirdLevelCat/${event.target.value}`).then((res) => {
      if (res?.error === false) {
        setProductData(res?.data)
      }
    })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;

    const updatedItems = productData.map((item) => ({
      ...item,
      checked: isChecked,
    }));
    setProductData(updatedItems);

    if (isChecked) {
      const ids = updatedItems.map((item) => item._id).sort((a, b) => a - b)
      setSortedIds(ids);
    } else {
      setSortedIds([]);
    }
  }

  const handleCheckboxChange = (e, id, index) => {
    const updatedItems = productData.map((item) =>
      item._id === id ? { ...item, checked: !item.checked } : item
    );
    setProductData(updatedItems);

    const selectedIds = updatedItems
      .filter((item) => item.checked)
      .map((item) => item._id)
      .sort((a, b) => a - b);
    setSortedIds(selectedIds);
  };



  return (
    <>
      {/*Front View*/}
      <div className='w-full !py-2 !px-5 !bg-white !border !border-[rgba(0,0,0,0.1)] flex items-center gap-8 !mb-5 
      justify-between !rounded-md'>
        <div className='info'>
          <h1 className='text-[35px] !text-[600] !font-bold leading-10 !mb-3'>Good Morning,<br />
            <span className="inline-flex items-center gap-2">
              Admin
              <img
                src="/wave.png"
                className="w-[40px] inline-block animate-wave"
                alt="wave"
              />
            </span>
          </h1>
          <p>Here's What happening on your store today. See the statistics at once.</p>
          <br />
          <Button className='btn-blue !capitalise gap-3 justify-between' onClick={() => context.setIsOpenFullScreenPanel({
            open: true,
            model: 'Add Product'
          })}>
            <FaPlus />
            Add Product
          </Button>
        </div>

        <img src="/shopDashboard.webp" className='w-[250px]' />
      </div>
      <DashboardBoxes />


      {/*Tailwind CSS Table*/}
      {/* <div className='card !mt-5 !my-2 !shadow=md sm:rounded-lg !bg-white'>
        <div className='flex items-center justify-between !px-5 !py-5'>
          <h1 className='text-[18px] font-[600]'>Products</h1>
        </div>

        <div className='flex items-center w-full !pl-5 justify-between'>
          <div className='col w-[20%] '>
            <h4 className='font-[600] text-[12px] !mb-2'>Category by</h4>
            <Select
              className='w-full !mb-2'
              size='small'
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={categoryFilterVal}
              onChange={handleChangeCatFilter}
              label="Category"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={10}>Men</MenuItem>
              <MenuItem value={20}>Women</MenuItem>
              <MenuItem value={30}>Kids</MenuItem>
            </Select>
          </div>

          <div className='col w-[29%] !ml-auto flex items-center gap-3 !px-5'>
            <Button className='btn !bg-green-600 !text-white btn-sm flex items-center gap-2'><BiExport />Export</Button>
            <Button className='btn-blue !text-white btn-sm  flex items-center btn gap-2'
              onClick={() => context.setIsOpenFullScreenPanel({
                open: true,
                model: 'Add Product'
              })}>
              <IoBagAddOutline />
              Add Product
            </Button>
          </div>
        </div>


        <div className="relative overflow-x-auto !pb-5">
          <table className="w-full text-sm text-left rtl:text-right text-body border-collapse">
            <thead className="text-sm text-body bg-[#f1f1f1] !border-b !border-[rgba(0,0,0,0.1)]">
              <tr>
                <th scope="col" className="!px-6 !pr-0 !py-3 font-medium" width="10%">
                  <div className='w-[60px]'>
                    <Checkbox size='small' />
                  </div>
                </th>
                <th scope="col" className="!px-2 !py-3 font-medium whitespace-nowrap">
                  PRODUCT
                </th>
                <th scope="col" className="!px-6 !py-3 font-medium whitespace-nowrap">
                  CATEGORY
                </th>
                <th scope="col" className="!px-6 !py-3 font-medium whitespace-nowrap">
                  SUB CATEGORY
                </th>
                <th scope="col" className="!px-6 !py-3 font-medium whitespace-nowrap">
                  PRICE
                </th>
                <th scope="col" className="!px-6 !py-3 font-medium whitespace-nowrap">
                  SALES
                </th>
                <th scope="col" className="!px-6 !py-3 font-medium whitespace-nowrap">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className='!odd:bg-white !odd:dark:bg-gray-900 !even:bg-gray-50
              !even:dark:bg-gray-800 border-b dark:border-gray-700'>
                <td className='!px-6 !pr-0 !py-3'>
                  <div className='w-[60px]'>
                    <Checkbox size='small' />
                  </div>
                </td>
                <td className='!px-2 !py-3'>
                  <div className='flex items-center gap-4 w-[300px]'>
                    <div className='img !w-[65px] !h-[65px] !rounded-md !overflow-hidden group'>
                      <Link to="/product/45745">

                        <img src="https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/e/6/e602addAW25GGDWKS2787_1.jpg"
                          className='w-full group-hover:scale-105 transition-all' />
                      </Link>
                    </div>

                    <div className='info w-[75%]'>
                      <h3 className='font-[600] text-[14px] leading-4 hover:text-blue-500 '>
                        <Link to="/product/45745">
                          Teal Printed Crepe Co-Ord Set Diwalicious
                        </Link>
                      </h3>
                      <span className='text-[12px]'>
                        Gajra Gang
                      </span>
                    </div>

                  </div>
                </td>

                <td className='!px-6 !py-3'>
                  Fashion
                </td>

                <td className='!px-6 !py-3'>
                  Women
                </td>
                <td className='!px-6 !py-3'>
                  <div className='flex gap-1 flex-col'>
                    <span className='oldPrice line-through leading-3 text-gray-500 text-[15px] font-[500]'>
                      ₹400.00</span>
                    <span className='price text-blue-500 text-[15px] font-[600]'>
                      ₹500.00</span>
                  </div>
                </td>

                <td className='!px-6 !py-3'>
                  <p className='text-[14px] w-[100px]'>
                    <span className='font-[600]'>
                      234
                    </span>
                    sales
                  </p>
                  <Progress value={50} type="warning" />
                </td>

                <td className='!px-6 !py-3'>
                  <div className='flex items-center gap-1'>
                    <Button className='!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]'>
                      <MdOutlineModeEdit className='text-[rgba(0,0,0,0.7)] text-[20px] ' />
                    </Button>
                    <Button className='!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]'>
                      <FiEye className='text-[rgba(0,0,0,0.7)] text-[20px] ' />
                    </Button>

                    <Button className='!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]'>
                      <GoTrash className='text-[rgba(0,0,0,0.7)] text-[20px] ' />
                    </Button>
                  </div>
                </td>

              </tr>

              <tr className='!odd:bg-white !odd:dark:bg-gray-900 !even:bg-gray-50
              !even:dark:bg-gray-800 border-b dark:border-gray-700'>
                <td className='!px-6 !pr-0 !py-3'>
                  <div className='w-[60px]'>
                    <Checkbox size='small' />
                  </div>
                </td>
                <td className='!px-2 !py-3'>
                  <div className='flex items-center gap-4 w-[300px]'>
                    <div className='img !w-[65px] !h-[65px] !rounded-md !overflow-hidden group'>
                      <Link to="/product/45745">

                        <img src="https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/e/6/e602addAW25GGDWKS2787_2.jpg"
                          className='w-full group-hover:scale-105 transition-all' />
                      </Link>
                    </div>

                    <div className='info w-[75%]'>
                      <h3 className='font-[600] text-[14px] leading-4 hover:text-blue-500 '>
                        <Link to="/product/45745">
                          Teal Printed Crepe Co-Ord Set Diwalicious
                        </Link>
                      </h3>
                      <span className='text-[12px]'>
                        Gajra Gang
                      </span>
                    </div>

                  </div>
                </td>

                <td className='!px-6 !py-3'>
                  Fashion
                </td>

                <td className='!px-6 !py-3'>
                  Women
                </td>
                <td className='!px-6 !py-3'>
                  <div className='flex gap-1 flex-col'>
                    <span className='oldPrice line-through leading-3 text-gray-500 text-[15px] font-[500]'>
                      ₹400.00</span>
                    <span className='price text-blue-500 text-[15px] font-[600]'>
                      ₹500.00</span>
                  </div>
                </td>

                <td className='!px-6 !py-3'>
                  <p className='text-[14px] w-[100px]'>
                    <span className='font-[600]'>
                      234
                    </span>
                    sales
                  </p>
                  <Progress value={50} type="warning" />
                </td>

                <td className='!px-6 !py-3'>
                  <div className='flex items-center gap-1'>
                    <Button className='!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]'>
                      <MdOutlineModeEdit className='text-[rgba(0,0,0,0.7)] text-[20px] ' />
                    </Button>
                    <Button className='!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]'>
                      <FiEye className='text-[rgba(0,0,0,0.7)] text-[20px] ' />
                    </Button>

                    <Button className='!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]'>
                      <GoTrash className='text-[rgba(0,0,0,0.7)] text-[20px] ' />
                    </Button>
                  </div>
                </td>

              </tr>

              <tr className='!odd:bg-white !odd:dark:bg-gray-900 !even:bg-gray-50
              !even:dark:bg-gray-800 border-b dark:border-gray-700'>
                <td className='!px-6 !pr-0 !py-3'>
                  <div className='w-[60px]'>
                    <Checkbox size='small' />
                  </div>
                </td>
                <td className='!px-2 !py-3'>
                  <div className='flex items-center gap-4 w-[300px]'>
                    <div className='img !w-[65px] !h-[65px] !rounded-md !overflow-hidden group'>
                      <Link to="/product/45745">

                        <img src="https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/e/6/e602addAW25GGDWKS2787_6.jpg"
                          className='w-full group-hover:scale-105 transition-all' />
                      </Link>
                    </div>

                    <div className='info w-[75%]'>
                      <h3 className='font-[600] text-[14px] leading-4 hover:text-blue-500 '>
                        <Link to="/product/45745">
                          Teal Printed Crepe Co-Ord Set Diwalicious
                        </Link>
                      </h3>
                      <span className='text-[12px]'>
                        Gajra Gang
                      </span>
                    </div>

                  </div>
                </td>

                <td className='!px-6 !py-3'>
                  Fashion
                </td>

                <td className='!px-6 !py-3'>
                  Women
                </td>
                <td className='!px-6 !py-3'>
                  <div className='flex gap-1 flex-col'>
                    <span className='oldPrice line-through leading-3 text-gray-500 text-[15px] font-[500]'>
                      ₹400.00</span>
                    <span className='price text-blue-500 text-[15px] font-[600]'>
                      ₹500.00</span>
                  </div>
                </td>

                <td className='!px-6 !py-3'>
                  <p className='text-[14px] w-[100px]'>
                    <span className='font-[600]'>
                      234
                    </span>
                    sales
                  </p>
                  <Progress value={50} type="warning" />
                </td>

                <td className='!px-6 !py-3'>
                  <div className='flex items-center gap-1'>
                    <Button className='!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]'>
                      <MdOutlineModeEdit className='text-[rgba(0,0,0,0.7)] text-[20px] ' />
                    </Button>
                    <Button className='!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]'>
                      <FiEye className='text-[rgba(0,0,0,0.7)] text-[20px] ' />
                    </Button>

                    <Button className='!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]'>
                      <GoTrash className='text-[rgba(0,0,0,0.7)] text-[20px] ' />
                    </Button>
                  </div>
                </td>

              </tr>

              <tr className='!odd:bg-white !odd:dark:bg-gray-900 !even:bg-gray-50
              !even:dark:bg-gray-800 border-b dark:border-gray-700'>
                <td className='!px-6 !pr-0 !py-3'>
                  <div className='w-[60px]'>
                    <Checkbox size='small' />
                  </div>
                </td>
                <td className='!px-2 !py-3'>
                  <div className='flex items-center gap-4 w-[300px]'>
                    <div className='img !w-[65px] !h-[65px] !rounded-md !overflow-hidden group'>
                      <Link to="/product/45745">

                        <img src="https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/e/6/e602addAW25GGDWKS2787_4.jpg"
                          className='w-full group-hover:scale-105 transition-all' />
                      </Link>
                    </div>

                    <div className='info w-[75%]'>
                      <h3 className='font-[600] text-[14px] leading-4 hover:text-blue-500 '>
                        <Link to="/product/45745">
                          Teal Printed Crepe Co-Ord Set Diwalicious
                        </Link>
                      </h3>
                      <span className='text-[12px]'>
                        Gajra Gang
                      </span>
                    </div>

                  </div>
                </td>

                <td className='!px-6 !py-3'>
                  Fashion
                </td>

                <td className='!px-6 !py-3'>
                  Women
                </td>
                <td className='!px-6 !py-3'>
                  <div className='flex gap-1 flex-col'>
                    <span className='oldPrice line-through leading-3 text-gray-500 text-[15px] font-[500]'>
                      ₹400.00</span>
                    <span className='price text-blue-500 text-[15px] font-[600]'>
                      ₹500.00</span>
                  </div>
                </td>

                <td className='!px-6 !py-3'>
                  <p className='text-[14px] w-[100px]'>
                    <span className='font-[600]'>
                      234
                    </span>
                    sales
                  </p>
                  <Progress value={50} type="warning" />
                </td>

                <td className='!px-6 !py-3'>
                  <div className='flex items-center gap-1'>
                    <Button className='!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]'>
                      <MdOutlineModeEdit className='text-[rgba(0,0,0,0.7)] text-[20px] ' />
                    </Button>
                    <Button className='!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]'>
                      <FiEye className='text-[rgba(0,0,0,0.7)] text-[20px] ' />
                    </Button>

                    <Button className='!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]'>
                      <GoTrash className='text-[rgba(0,0,0,0.7)] text-[20px] ' />
                    </Button>
                  </div>
                </td>

              </tr>

              <tr className='!odd:bg-white !odd:dark:bg-gray-900 !even:bg-gray-50
              !even:dark:bg-gray-800 border-b dark:border-gray-700'>
                <td className='!px-6 !pr-0 !py-3'>
                  <div className='w-[60px]'>
                    <Checkbox size='small' />
                  </div>
                </td>
                <td className='!px-2 !py-3'>
                  <div className='flex items-center gap-4 w-[300px]'>
                    <div className='img !w-[65px] !h-[65px] !rounded-md !overflow-hidden group'>
                      <Link to="/product/45745">

                        <img src="https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/e/6/e602addAW25GGDWKS2787_5.jpg"
                          className='w-full group-hover:scale-105 transition-all' />
                      </Link>
                    </div>

                    <div className='info w-[75%]'>
                      <h3 className='font-[600] text-[14px] leading-4 hover:text-blue-500 '>
                        <Link to="/product/45745">
                          Teal Printed Crepe Co-Ord Set Diwalicious
                        </Link>
                      </h3>
                      <span className='text-[12px]'>
                        Gajra Gang
                      </span>
                    </div>

                  </div>
                </td>

                <td className='!px-6 !py-3'>
                  Fashion
                </td>

                <td className='!px-6 !py-3'>
                  Women
                </td>
                <td className='!px-6 !py-3'>
                  <div className='flex gap-1 flex-col'>
                    <span className='oldPrice line-through leading-3 text-gray-500 text-[15px] font-[500]'>
                      ₹400.00</span>
                    <span className='price text-blue-500 text-[15px] font-[600]'>
                      ₹500.00</span>
                  </div>
                </td>

                <td className='!px-6 !py-3'>
                  <p className='text-[14px] w-[100px]'>
                    <span className='font-[600]'>
                      234
                    </span>
                    sales
                  </p>
                  <Progress value={50} type="warning" />
                </td>

                <td className='!px-6 !py-3'>
                  <div className='flex items-center gap-1'>
                    <Button className='!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]'>
                      <MdOutlineModeEdit className='text-[rgba(0,0,0,0.7)] text-[20px] ' />
                    </Button>
                    <Button className='!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]'>
                      <FiEye className='text-[rgba(0,0,0,0.7)] text-[20px] ' />
                    </Button>

                    <Button className='!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]'>
                      <GoTrash className='text-[rgba(0,0,0,0.7)] text-[20px] ' />
                    </Button>
                  </div>
                </td>

              </tr>

              <tr className='!odd:bg-white !odd:dark:bg-gray-900 !even:bg-gray-50
              !even:dark:bg-gray-800 border-b dark:border-gray-700'>
                <td className='!px-6 !pr-0 !py-3'>
                  <div className='w-[60px]'>
                    <Checkbox size='small' />
                  </div>
                </td>
                <td className='!px-2 !py-3'>
                  <div className='flex items-center gap-4 w-[300px]'>
                    <div className='img !w-[65px] !h-[65px] !rounded-md !overflow-hidden group'>
                      <Link to="/product/45745">

                        <img src="https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/e/6/e602addAW25GGDWKS2787_3.jpg"
                          className='w-full group-hover:scale-105 transition-all' />
                      </Link>
                    </div>

                    <div className='info w-[75%]'>
                      <h3 className='font-[600] text-[14px] leading-4 hover:text-blue-500 '>
                        <Link to="/product/45745">
                          Teal Printed Crepe Co-Ord Set Diwalicious
                        </Link>
                      </h3>
                      <span className='text-[12px]'>
                        Gajra Gang
                      </span>
                    </div>

                  </div>
                </td>

                <td className='!px-6 !py-3'>
                  Fashion
                </td>

                <td className='!px-6 !py-3'>
                  Women
                </td>
                <td className='!px-6 !py-3'>
                  <div className='flex gap-1 flex-col'>
                    <span className='oldPrice line-through leading-3 text-gray-500 text-[15px] font-[500]'>
                      ₹400.00</span>
                    <span className='price text-blue-500 text-[15px] font-[600]'>
                      ₹500.00</span>
                  </div>
                </td>

                <td className='!px-6 !py-3'>
                  <p className='text-[14px] w-[100px]'>
                    <span className='font-[600]'>
                      234
                    </span>
                    sales
                  </p>
                  <Progress value={50} type="warning" />
                </td>

                <td className='!px-6 !py-3'>
                  <div className='flex items-center gap-1'>
                    <Button className='!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]'>
                      <MdOutlineModeEdit className='text-[rgba(0,0,0,0.7)] text-[20px] ' />
                    </Button>
                    <Button className='!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]'>
                      <FiEye className='text-[rgba(0,0,0,0.7)] text-[20px] ' />
                    </Button>

                    <Button className='!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]'>
                      <GoTrash className='text-[rgba(0,0,0,0.7)] text-[20px] ' />
                    </Button>
                  </div>
                </td>

              </tr>

              <tr className='!odd:bg-white !odd:dark:bg-gray-900 !even:bg-gray-50
              !even:dark:bg-gray-800 border-b dark:border-gray-700'>
                <td className='!px-6 !pr-0 !py-3'>
                  <div className='w-[60px]'>
                    <Checkbox size='small' />
                  </div>
                </td>
                <td className='!px-2 !py-3'>
                  <div className='flex items-center gap-4 w-[300px]'>
                    <div className='img !w-[65px] !h-[65px] !rounded-md !overflow-hidden group'>
                      <Link to="/product/45745">

                        <img src="https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/e/6/e602addAW25GGDWKS2787_2.jpg"
                          className='w-full group-hover:scale-105 transition-all' />
                      </Link>
                    </div>

                    <div className='info w-[75%]'>
                      <h3 className='font-[600] text-[14px] leading-4 hover:text-blue-500 '>
                        <Link to="/product/45745">
                          Teal Printed Crepe Co-Ord Set Diwalicious
                        </Link>
                      </h3>
                      <span className='text-[12px]'>
                        Gajra Gang
                      </span>
                    </div>

                  </div>
                </td>

                <td className='!px-6 !py-3'>
                  Fashion
                </td>

                <td className='!px-6 !py-3'>
                  Women
                </td>
                <td className='!px-6 !py-3'>
                  <div className='flex gap-1 flex-col'>
                    <span className='oldPrice line-through leading-3 text-gray-500 text-[15px] font-[500]'>
                      ₹400.00</span>
                    <span className='price text-blue-500 text-[15px] font-[600]'>
                      ₹500.00</span>
                  </div>
                </td>

                <td className='!px-6 !py-3'>
                  <p className='text-[14px] w-[100px]'>
                    <span className='font-[600]'>
                      234
                    </span>
                    sales
                  </p>
                  <Progress value={50} type="warning" />
                </td>

                <td className='!px-6 !py-3'>
                  <div className='flex items-center gap-1'>
                    <Button className='!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]'>
                      <MdOutlineModeEdit className='text-[rgba(0,0,0,0.7)] text-[20px] ' />
                    </Button>
                    <Button className='!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]'>
                      <FiEye className='text-[rgba(0,0,0,0.7)] text-[20px] ' />
                    </Button>

                    <Button className='!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]'>
                      <GoTrash className='text-[rgba(0,0,0,0.7)] text-[20px] ' />
                    </Button>
                  </div>
                </td>

              </tr>

              <tr className='!odd:bg-white !odd:dark:bg-gray-900 !even:bg-gray-50
              !even:dark:bg-gray-800 border-b dark:border-gray-700'>
                <td className='!px-6 !pr-0 !py-3'>
                  <div className='w-[60px]'>
                    <Checkbox size='small' />
                  </div>
                </td>
                <td className='!px-2 !py-3'>
                  <div className='flex items-center gap-4 w-[300px]'>
                    <div className='img !w-[65px] !h-[65px] !rounded-md !overflow-hidden group'>
                      <Link to="/product/45745">

                        <img src="https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/e/6/e602addAW25GGDWKS2787_6.jpg"
                          className='w-full group-hover:scale-105 transition-all' />
                      </Link>
                    </div>

                    <div className='info w-[75%]'>
                      <h3 className='font-[600] text-[14px] leading-4 hover:text-blue-500 '>
                        <Link to="/product/45745">
                          Teal Printed Crepe Co-Ord Set Diwalicious
                        </Link>
                      </h3>
                      <span className='text-[12px]'>
                        Gajra Gang
                      </span>
                    </div>

                  </div>
                </td>

                <td className='!px-6 !py-3'>
                  Fashion
                </td>

                <td className='!px-6 !py-3'>
                  Women
                </td>
                <td className='!px-6 !py-3'>
                  <div className='flex gap-1 flex-col'>
                    <span className='oldPrice line-through leading-3 text-gray-500 text-[15px] font-[500]'>
                      ₹400.00</span>
                    <span className='price text-blue-500 text-[15px] font-[600]'>
                      ₹500.00</span>
                  </div>
                </td>

                <td className='!px-6 !py-3'>
                  <p className='text-[14px] w-[100px]'>
                    <span className='font-[600]'>
                      234
                    </span>
                    sales
                  </p>
                  <Progress value={50} type="warning" />
                </td>

                <td className='!px-6 !py-3'>
                  <div className='flex items-center gap-1'>
                    <Button className='!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]'>
                      <MdOutlineModeEdit className='text-[rgba(0,0,0,0.7)] text-[20px] ' />
                    </Button>
                    <Button className='!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]'>
                      <FiEye className='text-[rgba(0,0,0,0.7)] text-[20px] ' />
                    </Button>

                    <Button className='!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]'>
                      <GoTrash className='text-[rgba(0,0,0,0.7)] text-[20px] ' />
                    </Button>
                  </div>
                </td>

              </tr>

            </tbody>

          </table>
        </div>

        <div className='flex items-center !justify-end !pt-2 !pb-5'>
          <Pagination count={10} color='primary' />
        </div>

      </div> */}


      {/*Material UI Table*/}
      <div className='card !my-4 !pt-5 !shadow=md sm:rounded-lg !bg-white' >
        <div className='flex items-center w-full !px-5 justify-between gap-4 !mb-2'>
          <div className='col w-[15%] '>
            <h4 className='font-[600] text-[12px] !mb-2'>Category by</h4>
            {
              context?.catData.length !== 0 &&
              <Select
                style={{ zoom: '80%' }}
                labelId="demo-simple-select-label"
                id="productCatDrop"
                size='small'
                className='w-full !bg-[#fafafa]'
                value={productCat}
                label="Category"
                onChange={handleChangeProductCat}
              >
                {
                  context?.catData.map((cat, index) => {
                    return (
                      <MenuItem value={cat?._id}
                      // onClick={() =>
                      //     selectCatByName(cat?.name)
                      // }
                      >{cat?.name}</MenuItem>
                    )
                  })
                }
              </Select>
            }
          </div>

          <div className='col w-[15%] '>
            <h4 className='font-[600] text-[12px] !mb-2'>Sub Category by</h4>
            {
              context?.catData.length !== 0 &&
              <Select
                labelId="demo-simple-select-label"
                style={{ zoom: '80%' }}
                id="productSubCatDrop"
                size='small'
                className='w-full !bg-[#fafafa]'
                value={productSubCat}
                label="Sub Category"
                onChange={handleChangeProductSubCat}
              >
                {
                  context?.catData.map((cat, index) => {
                    return (
                      cat?.children?.length !== 0 && cat?.children?.map((subCat, index_) => {
                        return (
                          <MenuItem value={subCat?._id}
                          // onClick={() =>
                          //     selectSubCatByName(cat?.name)
                          // }
                          >{subCat?.name}</MenuItem>
                        )
                      })
                    )
                  })
                }
              </Select>
            }
          </div>

          <div className='col w-[20%] '>
            <h4 className='font-[600] text-[12px] !mb-2'>Third Level Category by</h4>
            {
              context?.catData.length !== 0 &&
              <Select
                style={{ zoom: '80%' }}
                labelId="demo-simple-select-label"
                id="productThirdLevelCatDrop"
                size='small'
                className='w-full !bg-[#fafafa]'
                value={productThirdLevelCat}
                label="Third Level Category"
                onChange={handleChangeProductThirdLevelCat}
              >
                {
                  context?.catData.map((cat) => {
                    return (
                      cat?.children?.length !== 0 && cat?.children?.map((subCat) => {
                        return (
                          subCat?.children?.length !== 0 && subCat?.children?.map((thirdLevelCat, index) => {
                            return (
                              <MenuItem
                                value={thirdLevelCat?._id}
                                key={index}
                              // onClick={() =>
                              //     selectSubCatThirdLevel
                              // }
                              >
                                {thirdLevelCat?.name}</MenuItem>
                            )
                          })
                        )
                      })
                    )
                  })
                }
              </Select>
            }
          </div>

          <div className='col w-[20%] !ml-auto'>
            <SearchBox />
          </div>


        </div>


        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead >

              <TableRow>
                <TableCell >
                  <Checkbox size='small'
                    onChange={handleSelectAll}
                    checked={productData?.length > 0 ? productData.every((item) => item.checked) : false} />
                </TableCell>

                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>


              {
                isLoading === false ? productData?.length !== 0 && productData?.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )?.map((product, index) => {
                  return (
                    <TableRow key={product?._id || index}>
                      <TableCell style={{ minWidth: columns.minWidth }}>
                        <Checkbox size='small'
                          checked={product.checked === true ? true : false}
                          onChange={(e) => handleCheckboxChange(e, product._id, index)} />
                      </TableCell>

                      <TableCell style={{ minWidth: columns.minWidth }}>
                        <div className='flex items-center gap-4 w-[300px]'>
                          <div className='img !w-[65px] !h-[65px] !rounded-md !overflow-hidden group'>
                            <Link to={`/products/${product?._id}`}>
                              <LazyLoadImage
                                alt={product?.name}
                                effect='blur'
                                className='w-full group-hover:scale-105 transition-all'
                                src={product?.images?.[0]}
                              />
                            </Link>
                          </div>

                          <div className='info w-[75%]'>
                            <h3 className='font-[600] text-[14px] leading-4 hover:text-blue-500 '>
                              <Link to={`/products/${product?._id}`}>
                                {product?.name}
                              </Link>
                            </h3>
                            <span className='text-[12px]'>
                              {product?.brand}
                            </span>
                          </div>

                        </div>
                      </TableCell>

                      <TableCell style={{ minWidth: columns.minWidth }}>
                        {product?.catName}
                      </TableCell>

                      <TableCell style={{ minWidth: columns.minWidth }}>
                        {product?.subCat}
                      </TableCell>

                      <TableCell style={{ minWidth: columns.minWidth }}>
                        <div className='flex gap-1 flex-col'>
                          <span className='oldPrice line-through leading-3 text-gray-500 text-[15px] font-[500]'>
                            &#8377; {product?.oldPrice}</span>
                          <span className='price text-blue-500 text-[15px] font-[600]'>
                            &#8377; {product?.price}</span>
                        </div>
                      </TableCell>

                      <TableCell style={{ minWidth: columns.minWidth }}>
                        <p className='text-[14px] w-[100px]'>
                          <span className='font-[600]'>
                            {product?.sale}
                          </span>
                          sale
                        </p>
                      </TableCell>

                      <TableCell style={{ minWidth: columns.minWidth }}>
                        <p className='text-[14px] w-[100px]'>
                          <Rating
                            name="half-rating"
                            size='small'
                            defaultValue={product?.rating}
                            precision={0.5}
                          />

                        </p>
                      </TableCell>

                      <TableCell style={{ minWidth: columns.minWidth }}>
                        <div className='flex items-center gap-1'>
                          <Button className='!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]'
                            onClick={() => context.setIsOpenFullScreenPanel({
                              open: true,
                              model: 'Edit Product',
                              id: product?._id
                            })}>
                            <MdOutlineModeEdit className='text-[rgba(0,0,0,0.7)] text-[20px] ' />
                          </Button>

                          <Link to={`/products/${product?._id}`}>
                            <Button className='!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]'>
                              <FiEye className='text-[rgba(0,0,0,0.7)] text-[20px] ' />
                            </Button>
                          </Link>

                          <Button className='!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]'
                            onClick={() => { deleteProduct(product?._id) }}>
                            <GoTrash className='text-[rgba(0,0,0,0.7)] text-[20px] ' />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>

                  )
                })

                  :
                  <>
                    <TableRow>
                      <TableCell colSpan={10}>
                        <div className='flex items-center justify-center w-full !min-h-[400px]'>
                          <CircularProgress color="inherit" />
                        </div>
                      </TableCell>
                    </TableRow>
                  </>
              }
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={productData?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

      </div >

      {/*Order Section*/}
      <div className='card !mt-5 !my-2 !shadow-md sm:rounded-lg !bg-white' >
        <div className='flex items-center justify-between !px-5 !py-5'>
          <h1 className='text-[18px] font-[600]'>Recent Orders</h1>
        </div>


        <div className="relative overflow-x-auto bg-white !shadow-xs rounded-md !border !border-[rgba(0,0,0,0.1)] !pb-5">
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
              <tr className="!bg-white !border-b !border-[rgba(0,0,0,0.1)] hover:!bg-gray-50">
                <td className="!px-6 !py-4">
                  <Button className='!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-[#f1f1f1]'
                    onClick={() => isShowOrderedProduct(0)}>
                    {
                      isOpenOrderedProduct === 0 ?
                        <FaAngleUp className='text-[16px] text-[rgba(0,0,0,0.7)]' /> :
                        <FaAngleDown className='text-[16px] text-[rgba(0,0,0,0.7)]' />
                    }
                  </Button>
                </td>

                <td className="!px-6 !py-4">
                  <span className='text-[#3872fa]'>6732kjhfjksah32ggfd</span>
                </td>

                <td className="!px-6 !py-4">
                  <span className='text-[#3872fa]'>pay_id63r87265sgf</span>
                </td>

                <td className="!px-6 !py-4 whitespace-nowrap">
                  Harsh Kumar
                </td>

                <td className="!px-6 !py-4">
                  3562372422
                </td>

                <td className="!px-6 !py-4">
                  <span className='block w-[400px]'> Sector 17, Buddha colony, Uttam Nagar, NewDelhi, 100001, India</span>
                </td>

                <td className="!px-6 !py-4">
                  571401
                </td>
                <td className="!px-6 !py-4">
                  5000.00
                </td>

                <td className="!px-6 !py-4">
                  iaefweu@gmail.com
                </td>

                <td className="!px-6 !py-4">
                  <span className='text-[#3872fa]'>763589263hjcgdhs9089</span>
                </td>

                <td className="!px-6 !py-4">
                  <Badge status="pending" />

                </td>

                <td className="!px-6 !py-4 whitespace-nowrap">
                  2024-12-04
                </td>
              </tr>


              {
                isOpenOrderedProduct === 0 && (
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
                            <tr className="!bg-white !border-b !border-[rgba(0,0,0,0.1)] hover:!bg-gray-50">
                              <td className="!px-6 !py-4">
                                <span className='text-gray-600'>6732kjhfjksah32ggfd</span>
                              </td>

                              <td className="!px-6 !py-4">
                                <span className='text-gray-600'>Cotton Set-Tie & Dye...</span>
                              </td>

                              <td className="!px-6 !py-4 whitespace-nowrap">
                                <img src="https://media.cnn.com/api/v1/images/stellar/prod/gettyimages-2239341361.jpg?c=16x9&q=w_1479,c_fill"
                                  className='w-[40px] h-[40px] object-cover whitespace-nowrap !rounded-md' />                                                                </td>

                              <td className="!px-6 !py-4">
                                2
                              </td>

                              <td className="!px-6 !py-4">
                                <span className='block'> 3000.00</span>
                              </td>

                              <td className="!px-6 !py-4">
                                3000.00
                              </td>
                            </tr>

                            <tr className="!bg-white !border-b !border-[rgba(0,0,0,0.1)] hover:!bg-gray-50">
                              <td className="!px-6 !py-4">
                                <span className='text-gray-600'>6732kjhfjksah32ggfd</span>
                              </td>

                              <td className="!px-6 !py-4">
                                <span className='text-gray-600'>Cotton Set-Tie & Dye...</span>
                              </td>

                              <td className="!px-6 !py-4 whitespace-nowrap">
                                <img src="https://media.cnn.com/api/v1/images/stellar/prod/gettyimages-2239341361.jpg?c=16x9&q=w_1479,c_fill"
                                  className='w-[40px] h-[40px] object-cover whitespace-nowrap !rounded-md' />                                                                </td>

                              <td className="!px-6 !py-4">
                                2
                              </td>

                              <td className="!px-6 !py-4">
                                <span className='block'> 3000.00</span>
                              </td>

                              <td className="!px-6 !py-4">
                                3000.00
                              </td>
                            </tr>


                            <tr>
                              <td className='bg-[#f1f1f1]' colSpan="12">

                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}



              <tr className="!bg-white !border-b !border-[rgba(0,0,0,0.1)] hover:!bg-gray-50">
                <td className="!px-6 !py-4">
                  <Button className='!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-[#f1f1f1]'
                    onClick={() => isShowOrderedProduct(1)}>
                    {
                      isOpenOrderedProduct === 1 ?
                        <FaAngleUp className='text-[16px] text-[rgba(0,0,0,0.7)]' /> :
                        <FaAngleDown className='text-[16px] text-[rgba(0,0,0,0.7)]' />
                    }
                  </Button>
                </td>

                <td className="!px-6 !py-4">
                  <span className='text-[#3872fa]'>6732kjhfjksah32ggfd</span>
                </td>

                <td className="!px-6 !py-4">
                  <span className='text-[#3872fa]'>pay_id63r87265sgf</span>
                </td>

                <td className="!px-6 !py-4 whitespace-nowrap">
                  Harsh Kumar
                </td>

                <td className="!px-6 !py-4">
                  3562372422
                </td>

                <td className="!px-6 !py-4">
                  <span className='block w-[400px]'> Sector 17, Buddha colony, Uttam Nagar, NewDelhi, 100001, India</span>
                </td>

                <td className="!px-6 !py-4">
                  571401
                </td>
                <td className="!px-6 !py-4">
                  5000.00
                </td>

                <td className="!px-6 !py-4">
                  iaefweu@gmail.com
                </td>

                <td className="!px-6 !py-4">
                  <span className='text-[#3872fa]'>763589263hjcgdhs9089</span>
                </td>

                <td className="!px-6 !py-4">
                  <Badge status="pending" />

                </td>

                <td className="!px-6 !py-4 whitespace-nowrap">
                  2024-12-04
                </td>
              </tr>


              {
                isOpenOrderedProduct === 1 && (
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
                            <tr className="!bg-white !border-b !border-[rgba(0,0,0,0.1)] hover:!bg-gray-50">
                              <td className="!px-6 !py-4">
                                <span className='text-gray-600'>6732kjhfjksah32ggfd</span>
                              </td>

                              <td className="!px-6 !py-4">
                                <span className='text-gray-600'>Cotton Set-Tie & Dye...</span>
                              </td>

                              <td className="!px-6 !py-4 whitespace-nowrap">
                                <img src="https://media.cnn.com/api/v1/images/stellar/prod/gettyimages-2239341361.jpg?c=16x9&q=w_1479,c_fill"
                                  className='w-[40px] h-[40px] object-cover whitespace-nowrap !rounded-md' />                                                                </td>

                              <td className="!px-6 !py-4">
                                2
                              </td>

                              <td className="!px-6 !py-4">
                                <span className='block'> 3000.00</span>
                              </td>

                              <td className="!px-6 !py-4">
                                3000.00
                              </td>
                            </tr>

                            <tr className="!bg-white !border-b !border-[rgba(0,0,0,0.1)] hover:!bg-gray-50">
                              <td className="!px-6 !py-4">
                                <span className='text-gray-600'>6732kjhfjksah32ggfd</span>
                              </td>

                              <td className="!px-6 !py-4">
                                <span className='text-gray-600'>Cotton Set-Tie & Dye...</span>
                              </td>

                              <td className="!px-6 !py-4 whitespace-nowrap">
                                <img src="https://media.cnn.com/api/v1/images/stellar/prod/gettyimages-2239341361.jpg?c=16x9&q=w_1479,c_fill"
                                  className='w-[40px] h-[40px] object-cover whitespace-nowrap !rounded-md' />                                                                </td>

                              <td className="!px-6 !py-4">
                                2
                              </td>

                              <td className="!px-6 !py-4">
                                <span className='block'> 3000.00</span>
                              </td>

                              <td className="!px-6 !py-4">
                                3000.00
                              </td>
                            </tr>


                            <tr>
                              <td className='bg-[#f1f1f1]' colSpan="12">

                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}



              <tr className="!bg-white !border-b !border-[rgba(0,0,0,0.1)] hover:!bg-gray-50">
                <td className="!px-6 !py-4">
                  <Button className='!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-[#f1f1f1]'
                    onClick={() => isShowOrderedProduct(2)}>
                    {
                      isOpenOrderedProduct === 2 ?
                        <FaAngleUp className='text-[16px] text-[rgba(0,0,0,0.7)]' /> :
                        <FaAngleDown className='text-[16px] text-[rgba(0,0,0,0.7)]' />
                    }
                  </Button>
                </td>

                <td className="!px-6 !py-4">
                  <span className='text-[#3872fa]'>6732kjhfjksah32ggfd</span>
                </td>

                <td className="!px-6 !py-4">
                  <span className='text-[#3872fa]'>pay_id63r87265sgf</span>
                </td>

                <td className="!px-6 !py-4 whitespace-nowrap">
                  Harsh Kumar
                </td>

                <td className="!px-6 !py-4">
                  3562372422
                </td>

                <td className="!px-6 !py-4">
                  <span className='block w-[400px]'> Sector 17, Buddha colony, Uttam Nagar, NewDelhi, 100001, India</span>
                </td>

                <td className="!px-6 !py-4">
                  571401
                </td>
                <td className="!px-6 !py-4">
                  5000.00
                </td>

                <td className="!px-6 !py-4">
                  iaefweu@gmail.com
                </td>

                <td className="!px-6 !py-4">
                  <span className='text-[#3872fa]'>763589263hjcgdhs9089</span>
                </td>

                <td className="!px-6 !py-4">
                  <Badge status="pending" />

                </td>

                <td className="!px-6 !py-4 whitespace-nowrap">
                  2024-12-04
                </td>
              </tr>


              {
                isOpenOrderedProduct === 2 && (
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
                            <tr className="!bg-white !border-b !border-[rgba(0,0,0,0.1)] hover:!bg-gray-50">
                              <td className="!px-6 !py-4">
                                <span className='text-gray-600'>6732kjhfjksah32ggfd</span>
                              </td>

                              <td className="!px-6 !py-4">
                                <span className='text-gray-600'>Cotton Set-Tie & Dye...</span>
                              </td>

                              <td className="!px-6 !py-4 whitespace-nowrap">
                                <img src="https://media.cnn.com/api/v1/images/stellar/prod/gettyimages-2239341361.jpg?c=16x9&q=w_1479,c_fill"
                                  className='w-[40px] h-[40px] object-cover whitespace-nowrap !rounded-md' />                                                                </td>

                              <td className="!px-6 !py-4">
                                2
                              </td>

                              <td className="!px-6 !py-4">
                                <span className='block'> 3000.00</span>
                              </td>

                              <td className="!px-6 !py-4">
                                3000.00
                              </td>
                            </tr>

                            <tr className="!bg-white !border-b !border-[rgba(0,0,0,0.1)] hover:!bg-gray-50">
                              <td className="!px-6 !py-4">
                                <span className='text-gray-600'>6732kjhfjksah32ggfd</span>
                              </td>

                              <td className="!px-6 !py-4">
                                <span className='text-gray-600'>Cotton Set-Tie & Dye...</span>
                              </td>

                              <td className="!px-6 !py-4 whitespace-nowrap">
                                <img src="https://media.cnn.com/api/v1/images/stellar/prod/gettyimages-2239341361.jpg?c=16x9&q=w_1479,c_fill"
                                  className='w-[40px] h-[40px] object-cover whitespace-nowrap !rounded-md' />                                                                </td>

                              <td className="!px-6 !py-4">
                                2
                              </td>

                              <td className="!px-6 !py-4">
                                <span className='block'> 3000.00</span>
                              </td>

                              <td className="!px-6 !py-4">
                                3000.00
                              </td>
                            </tr>


                            <tr>
                              <td className='bg-[#f1f1f1]' colSpan="12">

                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>


      </div>

      {/*Graph View*/}
      <div className='card !mt-5 !mb-2 !shadow-md sm:rounded-lg !bg-white' >
        <div className='flex items-center justify-between !px-5 !py-4 !mb-2 !pb-0'>
          <h1 className='text-[18px] font-[600]'>Total Users & Total Sales</h1>
        </div>

        <div className='flex items-center gap-5 !px-5 !py-4 !mb-2 !pt-1'>
          <span className='flex items-center gap-3 text-[15px]'><span className='block w-[8px] h-[8px] rounded-full bg-green-500'></span>Total Users</span>
          <span className='flex items-center gap-3 text-[15px]'><span className='block w-[8px] h-[8px] rounded-full bg-blue-500'></span>Total Sales</span>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={chart1Data}
            margin={{
              top: 10,
              right: 20,
              left: 10,
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke='none' />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis width="auto" tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="TotalSales" stroke="#8884d8" activeDot={{ r: 8 }} strokeWidth={3} />
            <Line type="monotone" dataKey="TotalUsers" stroke="#82ca9d" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  )
}

export default Dashboard