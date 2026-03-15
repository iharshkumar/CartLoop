import React, { useContext, useEffect, useState, useMemo } from 'react'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import '../Sidebar/style.css';
import { Collapse } from 'react-collapse';
import { FaAngleDown } from 'react-icons/fa6';
import Button from '@mui/material/Button';
import { FaAngleUp } from 'react-icons/fa6';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import Rating from '@mui/material/Rating';
import { MyContext } from '../../App';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchDataFromApi } from '../../utils/api';


const SideBar = (props) => {

    const [isOpenCategoryFilter, setIsOpenCategoryFilter] = useState(true);
    const [isOpenAvailFilter, setIsOpenAvailFilter] = useState(true);
    const [isOpenSizeFilter, setIsOpenSizeFilter] = useState(true);
    const context = useContext(MyContext);
    const [price, setPrice] = useState([0, 60000]);
    const [selectedCatIds, setSelectedCatIds] = useState([]);
    const [sizeData, setSizeData] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [rating, setRating] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    const getUrlCategoryIds = () => {
        const queryParameters = new URLSearchParams(location.search);

        const ids = {
            catId: [],
            subCatId: [],
            thirdLevelCatId: [],
            size: [],
        };

        // support multi-select via repeated query params: ?catId=a&catId=b
        ids.catId = queryParameters.getAll("catId").filter(Boolean);
        ids.size = queryParameters.getAll("size").filter(Boolean);

        const subCategoryId = queryParameters.get("subCatId");
        if (subCategoryId) ids.subCatId = [subCategoryId];

        const thirdCategoryId = queryParameters.get("thirdLevelCatId");
        if (thirdCategoryId) ids.thirdLevelCatId = [thirdCategoryId];

        return ids;
    };

    // keep selectedCatIds in sync with URL when it changes (e.g. navbar click)
    useEffect(() => {
        const urlIds = getUrlCategoryIds();
        setSelectedCatIds(urlIds.catId);
        setSelectedSizes(urlIds.size);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.search]);

    const setCatIdsInUrl = (catIds) => {
        const params = new URLSearchParams(location.search);

        // when user uses category checkboxes, we drive category filtering from catId only
        params.delete("subCatId");
        params.delete("thirdLevelCatId");
        params.delete("catId");

        catIds.forEach((id) => params.append("catId", id));

        const nextSearch = params.toString();
        navigate(`${location.pathname}${nextSearch ? `?${nextSearch}` : ""}`, { replace: true });
    };

    const setSizeInUrl = (sizes) => {
        const params = new URLSearchParams(location.search);
        params.delete("size");
        sizes.forEach((s) => params.append("size", s));

        const nextSearch = params.toString();
        navigate(`${location.pathname}${nextSearch ? `?${nextSearch}` : ""}`, { replace: true });
    };

    const filter = useMemo(() => {
        const urlIds = getUrlCategoryIds();
        const activeCatIds = selectedCatIds;

        return {
            catId: activeCatIds,
            subCatId: urlIds.subCatId,
            thirdLevelCatId: urlIds.thirdLevelCatId,
            size: selectedSizes,
            minPrice: price[0],
            maxPrice: price[1],
            rating: rating || '',
            availability: '',
            page: props.page || 1,
            perPage: 10,
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCatIds, selectedSizes, price, rating, location.search, props.page]);


    const filtersData = async () => {
        props?.setIsLoading(true);

        const params = new URLSearchParams();

        // catId can be multiple
        if (filter.catId && filter.catId.length > 0) {
            filter.catId.forEach((id) => params.append('catId', id));
        }

        if (filter.subCatId && filter.subCatId.length > 0) {
            filter.subCatId.forEach((id) => params.append('subCatId', id));
        }

        if (filter.thirdLevelCatId && filter.thirdLevelCatId.length > 0) {
            filter.thirdLevelCatId.forEach((id) => params.append('thirdsubCatId', id));
        }

        if (filter.size && filter.size.length > 0) {
            filter.size.forEach((name) => params.append('size', name));
        }

        if (filter.minPrice !== undefined && filter.minPrice !== null) {
            params.append('minPrice', filter.minPrice);
        }

        if (filter.maxPrice !== undefined && filter.maxPrice !== null) {
            params.append('maxPrice', filter.maxPrice);
        }

        if (filter.rating) {
            params.append('rating', filter.rating);
        }

        if (filter.page) {
            params.append('page', filter.page);
        }

        // backend expects "limit"
        params.append('limit', filter.perPage || 5);

        try {
            const res = await fetchDataFromApi(`/api/product/filter?${params.toString()}`);

            if (res?.error === false) {
                props?.setProductsData(res?.products || []);
                props?.setTotalPages(res?.totalPages || 1);
            } else {
                props?.setProductsData([]);
                props?.setTotalPages(1);
            }
        } finally {
            props?.setIsLoading(false);
            window.scrollTo(0, 0);
        }
    };


    useEffect(() => {
        filtersData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    useEffect(() => {
        fetchDataFromApi(`/api/product/productSIZE/get`).then((res) => {
            if (res?.error === false) {
                setSizeData(res?.data || []);
            }
        });
    }, []);

    return (
        <aside className='sidebar !py-3 sticky top-[40px] z-[40]'>
            <div className='box w-full bg-white !p-3 rounded-lg' >
                <h3 className='w-full mb-3 text-[16px] font-[600] flex items-center'>
                    Shop By Category
                    <Button className='!w-[30%] !h-[30px] !min-w-[30px] !rounded-full !ml-auto !text-[#000]'
                        onClick={() => setIsOpenCategoryFilter(!isOpenCategoryFilter)}>
                        {
                            isOpenCategoryFilter === true ? <FaAngleUp /> : <FaAngleDown />

                        }
                    </Button>
                </h3>

                <Collapse isOpened={isOpenCategoryFilter}>
                    <div className='scroll relative -left-[10px] !px-4'>
                        {
                            context?.catData?.length !== 0 && context?.catData?.map((item, index) => {
                                return (
                                    <FormGroup key={index} className='flex flex-col'>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    key={index}
                                                    name='catId'
                                                    value={item?._id}
                                                    onChange={() => {
                                                        setSelectedCatIds((prev) => {
                                                            const next = prev.includes(item?._id)
                                                                ? prev.filter((id) => id !== item?._id)
                                                                : [item?._id, ...prev];
                                                            setCatIdsInUrl(next);
                                                            return next;
                                                        });
                                                    }}
                                                    checked={filter.catId?.includes(item?._id)}
                                                />
                                            }
                                            label={item?.name}
                                        />
                                    </FormGroup>
                                )
                            })
                        }
                    </div>
                </Collapse>
            </div>
            <div className='box bg-white !p-3 rounded-lg' >
                <h3 className='!w-full mb-3 text-[16px] font-[600] flex items-center'>
                    Availability
                    <Button className='!w-[30%] !h-[30px] !min-w-[30px] !rounded-full !ml-auto !text-[#000]'
                        onClick={() => setIsOpenAvailFilter(!isOpenAvailFilter)}>
                        {
                            isOpenAvailFilter === true ? <FaAngleUp /> : <FaAngleDown />

                        }


                    </Button>
                </h3>

                <Collapse isOpened={isOpenAvailFilter}>
                    <div className='scroll relative -left-[10px] !px-4' >
                        <FormGroup className='flex flex-col'>
                            <FormControlLabel control={<Checkbox
                                size='small' />}
                                label="Available (17)"
                            />
                            <FormControlLabel control={<Checkbox
                                size='small' />}
                                label="In Stock (10)"
                            />

                            <FormControlLabel control={<Checkbox
                                size='small' />}
                                label="Not Available (1)"
                            />
                        </FormGroup>
                    </div>
                </Collapse>
            </div>


            <div className='box bg-white !p-3 rounded-lg' >
                <h3 className='!w-full mb-3 text-[16px] font-[600] flex items-center'>
                    Size
                    <Button className='!w-[30%] !h-[30px] !min-w-[30px] !rounded-full !ml-auto !text-[#000]'
                        onClick={() => setIsOpenSizeFilter(!isOpenSizeFilter)}>
                        {
                            isOpenSizeFilter === true ? <FaAngleUp /> : <FaAngleDown />

                        }


                    </Button>
                </h3>

                <Collapse isOpened={isOpenSizeFilter}>
                    <div className='scroll relative -left-[10px] !px-4'>
                        <FormGroup style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '5px' }}>
                            {
                                sizeData?.length !== 0 && sizeData?.map((item, index) => {
                                    return (
                                        <FormControlLabel
                                            key={index}
                                            control={
                                                <Checkbox
                                                    size='small'
                                                    name='size'
                                                    value={item?.name}
                                                    onChange={() => {
                                                        setSelectedSizes((prev) => {
                                                            const next = prev.includes(item?.name)
                                                                ? prev.filter((s) => s !== item?.name)
                                                                : [...prev, item?.name];
                                                            setSizeInUrl(next);
                                                            return next;
                                                        });
                                                    }}
                                                    checked={filter.size?.includes(item?.name)}
                                                />
                                            }
                                            label={item?.name}
                                            style={{ margin: 0 }}
                                        />
                                    )
                                })
                            }
                        </FormGroup>
                    </div>
                </Collapse>
            </div>

            <div className='box !w-[90%] !bg-white !p-3 rounded-lg'>
                <h3 className='!w-full !mb-3 text-[16px] font-[600] flex items-center'>
                    Filter by Price
                </h3>

                <RangeSlider value={price} onInput={setPrice} min={100} max={60000} step={5} />
                <div className='flex !pt-3 !pb-2 priceRange'>
                    <span className='text-[13px]'>
                        From: <strong className='text-dark'>Rs: {price[0]}  </strong>
                    </span>
                    <span className='text-[13px]'>
                        To: <strong className='text-dark'>Rs: {price[1]}</strong>
                    </span>
                </div>

            </div>

            <div className='box bg-white !p-3 rounded-lg !px-4'>
                <h3 className='!w-full mb-3 text-[16px] font-[600] flex items-center'>
                    Filter by Rating
                </h3>
                <div className='w-full'>
                    <Rating
                        name="product-rating-filter"
                        value={rating}
                        onChange={(event, newValue) => {
                            setRating(newValue);
                        }}
                        size="small"
                    />
                </div>
            </div>

        </aside>

    )
}

export default SideBar;