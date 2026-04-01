import React, { useContext, useMemo, useState } from 'react'
import SideBar from '../../components/SideBar';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import ProductItem from '../../components/ProductItem';
import Pagination from '@mui/material/Pagination';
import ProductItemListView from '../../components/ProductItemListView';
import Button from '@mui/material/Button';
import { IoGridSharp, IoFilterSharp } from 'react-icons/io5';
import { LuMenu } from 'react-icons/lu';
import Drawer from '@mui/material/Drawer';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ProductLoading from '../../components/ProductLoading';
import { fetchDataFromApi, postData } from '../../utils/api';
import { useLocation, useNavigate } from 'react-router-dom';
import { MyContext } from '../../App';


const ProductListing = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isItemView, setIsItemView] = useState('grid');
    const [anchorEl, setAnchorEl] = useState(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const open = Boolean(anchorEl);
    const context = useContext(MyContext)
    const [productsData, setProductsData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const query = new URLSearchParams(location.search);
    const page = query.get('page') ? Number(query.get('page')) : 1;
    const [totalPages, setTotalPages] = useState(1);

    const [selectedSortVal, setSelectedSortVal] = useState('Name, A-Z');

    const orderedProducts = useMemo(() => {
        const params = new URLSearchParams(location.search);
        const catOrder = params.getAll('catId');

        if (!catOrder.length || !productsData?.length) return productsData;

        const orderMap = new Map(catOrder.map((id, index) => [id, index]));

        return [...productsData].sort((a, b) => {
            const aIdx = orderMap.has(a.catId) ? orderMap.get(a.catId) : Infinity;
            const bIdx = orderMap.has(b.catId) ? orderMap.get(b.catId) : Infinity;

            if (aIdx !== bIdx) return aIdx - bIdx;
            return 0;
        });
    }, [location.search, productsData]);


    const activeCategoryNames = useMemo(() => {
        const params = new URLSearchParams(location.search);
        const catIds = params.getAll('catId');

        if (!catIds.length || !context?.catData) return [];

        return catIds.map(id => {
            const cat = context.catData.find(c => c._id === id);
            return cat ? { id: cat._id, name: cat.name } : null;
        }).filter(Boolean);
    }, [location.search, context?.catData]);


    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSortBy = (name, order, products, value) => {
        setSelectedSortVal(value);
        postData('/api/product/sortBy', {
            products: products,
            sortBy: name,
            order: order
        }).then((res) => {
            setProductsData(res?.products);
            setAnchorEl(null);
        })
    };

    const handlePageChange = (event, value) => {
        const params = new URLSearchParams(location.search);
        params.set("page", value);
        navigate(`${location.pathname}?${params.toString()}`);
    };
    return (
        <section className='py-8 !pb-0'>
            <div className='container !px-10 ' style={{ padding: '15px' }}>
                <Breadcrumbs aria-label="breadcrumb" >
                    <Link underline="hover" color="inherit" href="/" className='link transition'>
                        Home
                    </Link>
                    {activeCategoryNames.length > 0 ? (
                        activeCategoryNames.map((cat, index) => (
                            <Link
                                key={index}
                                underline="hover"
                                color="inherit"
                                href={`/products?catId=${cat.id}`}
                                className='link transition'
                            >
                                {cat.name}
                            </Link>
                        ))
                    ) : (
                        <span className='link transition cursor-default text-gray-500'>
                            Products
                        </span>
                    )}
                </Breadcrumbs>
            </div>
            <div className='w-full bg-white !py-3'>
                <div className='container flex flex-col lg:flex-row gap-4 lg:gap-6 '>
                    <div className='sidebarWrapper hidden lg:block w-[20%] sticky !top-[10px]'>
                        <SideBar
                            productsData={productsData}
                            setProductsData={setProductsData}
                            isLoading={isLoading}
                            setIsLoading={setIsLoading}
                            page={page}
                            totalPages={totalPages}
                            setTotalPages={setTotalPages}
                        />
                    </div>


                    <div className='rightContent w-full lg:w-[80%] !py-3'>
                        <div className='!w-full !mb-4 !rounded-xl flex flex-wrap md:flex-nowrap items-center justify-between !p-3 sticky !top-[80px] lg:!top-[130px] z-[50] shadow-sm border border-gray-100 bg-white/80 backdrop-blur-md transition-all gap-4' style={{ minHeight: '60px' }}>
                            <div className='col1 flex items-center gap-2 itemViewActions sm:w-auto justify-between sm:justify-start'>
                                {
                                    context?.windowWidth < 992 && (
                                        <Button className="!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-[#000] lg:hidden bg-gray-100" onClick={() => setIsFilterOpen(true)}>
                                            <IoFilterSharp className='text-[rgba(0,0,0,0.7)] text-[20px]' />
                                        </Button>
                                    )
                                }
                                <div className='flex items-center bg-gray-50 rounded-full p-1 border border-gray-100'>
                                    <Button className={`!w-[40px] !h-[35px] !min-w-[40px] !rounded-full !text-[#000] ${isItemView === "list" ? "bg-white shadow-sm active" : ""}`}
                                        onClick={() => setIsItemView('list')}
                                    >
                                        <LuMenu className='text-[rgba(0,0,0,0.7)]' />
                                    </Button>
                                    <Button className={`!w-[40px] !h-[35px] !min-w-[40px] !rounded-full !text-[#000] ${isItemView === "grid" ? "bg-white shadow-sm active" : ""}`}
                                        onClick={() => setIsItemView('grid')}
                                    >
                                        <IoGridSharp className='text-[rgba(0,0,0,0.7)]' />
                                    </Button>
                                </div>
                                <h6 className='whitespace-nowrap !m-0 text-[14px] font-[400] text-[rgba(0,0,0,0.7)]'>There are {productsData?.length} products</h6>
                            </div>



                            <div className='col2 ml-auto flex items-center justify-end gap-2'>
                                <span className='whitespace-nowrap !m-0 text-[14px] font-[400] text-[rgba(0,0,0,0.7)]'>Sort By</span>
                                <Button
                                    id="demo-positioned-button"
                                    aria-controls={open ? 'demo-positioned-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                    onClick={handleMenuClick}
                                    className='!bg-white text-[14px] !text-[#000] !text-capitalise border border-[#000]'
                                >
                                    {selectedSortVal}
                                </Button>


                                <Menu
                                    id="demo-positioned-menu"
                                    aria-labelledby="demo-positioned-button"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                    }}
                                >
                                    <MenuItem onClick={() => handleSortBy('name', 'asc', productsData, 'Name, A to Z ')} className='!text-[13px] !text-[#000] text-capitalise'>Name, A to Z</MenuItem>
                                    <MenuItem onClick={() => handleSortBy('name', 'desc', productsData, 'Name, Z to A ')} className='!text-[13px] !text-[#000] text-capitalise'>Name, Z to A</MenuItem>
                                    <MenuItem onClick={() => handleSortBy('sales', 'desc', productsData, 'Sales, highest to lowest ')} className='!text-[13px] !text-[#000] text-capitalise'>Sales,highest to lowest</MenuItem>
                                    <MenuItem onClick={() => handleSortBy('relevance', 'desc', productsData, 'Relevance ')} className='!text-[13px] !text-[#000] text-capitalise'>Relevance</MenuItem>
                                    <MenuItem onClick={() => handleSortBy('price', 'asc', productsData, 'Price, low to high ')} className='!text-[13px] !text-[#000] text-capitalise'>Price, low to high</MenuItem>
                                    <MenuItem onClick={() => handleSortBy('price', 'desc', productsData, 'Price, high to low ')} className='!text-[13px] !text-[#000] text-capitalise'>Price, high to low</MenuItem>
                                </Menu>
                            </div>



                        </div>

                        <div className={`!py-6 grid ${isItemView === 'grid' ? '!grid-cols-2 md:!grid-cols-3 lg:!grid-cols-4 gap-4' :
                            '!grid-cols-1 !md:grid-cols-1 !gap-2'}`}>

                            {
                                isItemView === 'grid' ?
                                    <>
                                        {
                                            isLoading === true ? <ProductLoading view={isItemView} />
                                                :
                                                orderedProducts?.length !== 0 && orderedProducts?.map((item, index) => {
                                                    return (
                                                        <ProductItem key={index} item={item} viewType={isItemView} />
                                                    )
                                                })
                                        }
                                    </>
                                    :
                                    <>
                                        {
                                            isLoading === true ? <ProductLoading view={isItemView} />
                                                :
                                                orderedProducts?.length !== 0 && orderedProducts?.map((item, index) => {
                                                    return (
                                                        <ProductItemListView key={index} item={item} viewType={isItemView} />
                                                    )
                                                })
                                        }
                                    </>
                            }

                        </div>

                        {
                            totalPages > 1 && !isLoading &&
                            <div className='flex items-center justify-center mt-10'>
                                <Pagination count={totalPages}
                                    showFirstButton showLastButton page={page}
                                    variant="outlined"
                                    shape="rounded"
                                    onChange={handlePageChange} />
                            </div>
                        }

                    </div>
                </div>
            </div>

            {/* Mobile Filter Drawer */}
            <Drawer
                anchor="left"
                open={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                className="lg:hidden"
                PaperProps={{
                    sx: { width: '85%', maxWidth: '300px' }
                }}
            >
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-lg m-0">Filters</h3>
                    <Button onClick={() => setIsFilterOpen(false)} className="!min-w-[30px] !w-[30px] !h-[30px] !rounded-full !bg-gray-100 text-black">
                        ✕
                    </Button>
                </div>
                <div className="!p-4 overflow-y-auto">
                    <SideBar
                        productsData={productsData}
                        setProductsData={setProductsData}
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                        page={page}
                        totalPages={totalPages}
                        setTotalPages={setTotalPages}
                    />
                </div>
            </Drawer>
        </section>
    )
}

export default ProductListing;
