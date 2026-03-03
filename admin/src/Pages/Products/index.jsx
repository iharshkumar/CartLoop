import { Button, Checkbox } from '@mui/material'
import Rating from '@mui/material/Rating';
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
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
import { BiExport } from "react-icons/bi";
import { IoBagAddOutline } from "react-icons/io5";
import SearchBox from '../../Components/SearchBox';
import { MyContext } from '../../App';
import { deleteData, deleteMultipleData, fetchDataFromApi } from '../../utils/api';
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'
import CircularProgress from '@mui/material/CircularProgress';




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

const Products = () => {
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [productData, setProductData] = useState([])
    const [productCat, setProductCat] = useState('');
    const [productSubCat, setProductSubCat] = useState('')
    const [productThirdLevelCat, setProductThirdLevelCat] = useState('');
    const context = useContext(MyContext)
    const [sortedIds, setSortedIds] = useState([])
    const [isLoading, setIsLoading] = useState(false)


    useEffect(() => {
        getProducts();
    }, [context?.isOpenFullScreenPanel])

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


    useEffect(() => {
        fetchDataFromApi("/api/product/getAllProducts").then((res) => {
            if (res?.error === false) {
                setProductData(res?.data)
            }
        })
    }, [])

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
    // const selectCatByName = (name) => {
    //     formFields.catName = name;
    //   }

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
    // const selectSubCatByName = (name) => {
    //     formFields.subCat = name;
    //   }
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
    // const selectSubCatThirdLevel = (name) => {
    //     formFields.thirdsubCat = name;
    //   }    



    const deleteProduct = (id) => {
        deleteData(`/api/product/${id}`).then((res) => {

            getProducts();
            context?.alertBox("success", "Product deleted")
        })
    }

    const deleteMultipleProduct = () => {

        if (sortedIds.length === 0) {
            context?.alertBox("error", "Please select items to delete.");
            return
        }

        try {
            deleteMultipleData(`/api/product/deleteMultiple`, {
                data: { ids: sortedIds },
            }).then((res) => {
                getProducts();
                context.alertBox("success", "Product Deleted");
            })
        } catch (error) {
            context.alertBox("error", "Error deleting item")
        }
    }


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    return (
        <>
            <div className='flex items-center justify-between !px-2 !py-0 !mt-3'>
                <h1 className='text-[20px] font-[600]'>Products</h1>
                <div className='col w-[50%] !ml-auto flex items-center !justify-end gap-3 '>
                    {
                        sortedIds?.length !== 0 &&
                        <Button
                            variant="contained"
                            className="btn-sm"
                            size='small' color='error'
                            onClick={deleteMultipleProduct}>
                            Delete
                        </Button>
                    }
                    <Button className='btn !bg-green-600 !text-white btn-sm flex items-center gap-2'><BiExport />Export</Button>
                    <Button className='btn-blue !text-white btn-sm flex items-center btn gap-2'
                        onClick={() => context.setIsOpenFullScreenPanel({
                            open: true,
                            model: 'Add Product'
                        })}>
                        <IoBagAddOutline />Add Product
                    </Button>
                </div>
            </div>


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
                                                                {product?.name}                                                            </Link>
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
        </>
    )
}

export default Products