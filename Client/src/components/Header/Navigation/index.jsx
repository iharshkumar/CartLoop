import Button from '@mui/material/Button';
import React, { useContext, useEffect, useState } from 'react'
import { RiMenu2Fill } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { LiaAngleDownSolid } from 'react-icons/lia';
import { GoRocket } from 'react-icons/go';
import CategoryPanel from './CategoryPanel';
import "../Navigation/style.css";
import { fetchDataFromApi } from "../../../utils/api"
import { MyContext } from '../../../App';
import MobileNav from './mobileNav.jsx';

const Navigation = (props) => {

    const [isOpenCatPanel, setIsOpenCatPanel] = React.useState(false);
    const [catData, setCatData] = useState([]);
    const context = useContext(MyContext)

    useEffect(() => {
        setCatData(context?.catData)
    }, [context?.catData])

    useEffect(() => {
        setIsOpenCatPanel(props?.isOpenCatPanel)
    }, [props?.isOpenCatPanel])

    const openCategoryPanel = () => {
        setIsOpenCatPanel(true);
    }

    return (
        <>
            <nav className="navigation relative z-[100] bg-white">
                <div className="container flex items-center !justify-start lg:!justify-end gap-8">
                    {
                        context?.windowWidth > 992 &&
                        <div className="col_1 w-[20%]">
                            <Button className='!text-black gap-2 w-full ' onClick={openCategoryPanel} >
                                <RiMenu2Fill className='text-[18px]' />Shop by Categories
                                <LiaAngleDownSolid className='text-[13px] ml-auto font-bold ' />
                            </Button>
                        </div>
                    }

                    <div className="col_2 w-full lg:w-[60%] relative z-50">
                        <ul className="flex items-center gap-3 nav relative z-50">
                            <li className="list-none">
                                <Link to="/" className="link transition !font-[500]">
                                    <Button className='link transition !font-[500] !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252] !py-1 lg:!py-4'>
                                        Home</Button>
                                </Link>
                            </li>
                            {
                                catData?.length !== 0 && catData?.map((cat, index) => {
                                    return (
                                        <li className="list-none relative group" key={index}>
                                            <Link to={`/products?catId=${cat?._id}`} className="link transition text-[14px] font-[500]">
                                                <Button className='link transition !font-[500] !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252] !py-1 lg:!py-4'>
                                                    {cat?.name}
                                                </Button>
                                            </Link>


                                            {
                                                cat?.children?.length !== 0 &&
                                                <div className='submenu absolute top-full left-0 min-w-[150px] bg-white shadow-md 
                                                opacity-0 invisible translate-y-2
                                                group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                                                transition-all duration-300 z-[9999]'>
                                                    <ul>
                                                        {
                                                            cat?.children?.map((subCat, index_) => {
                                                                return (
                                                                    <li className="list-none w-full relative group/men" key={index_}>
                                                                        <Link to={`/products?subCatId=${subCat?._id}`} className='w-full block'>
                                                                            <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left !justify-start !rounded-none">
                                                                                {subCat?.name}
                                                                            </Button>

                                                                            {
                                                                                subCat?.children?.length !== 0 &&
                                                                                <div className='absolute top-0 left-full min-w-[150px] bg-white shadow-md opacity-0 invisible translate-x-2 group-hover/men:opacity-100 group-hover/men:visible group-hover/men:translate-x-0  transition-all duration-300 z-[999]'>
                                                                                    <ul>
                                                                                        {
                                                                                            subCat?.children?.map((thirdLevelCat, index__) => {
                                                                                                return (
                                                                                                    <li className='list-none w-full' key={index__}>
                                                                                                        <Link to={`/products?thirdLevelCatId=${thirdLevelCat?._id}`} className='w-full'>
                                                                                                            <Button className="!text-[rgba(0,0,0,0.8)] w-full !justify-start !text-left !rounded-none">
                                                                                                                {thirdLevelCat?.name}
                                                                                                            </Button>
                                                                                                        </Link>
                                                                                                    </li>
                                                                                                )
                                                                                            })
                                                                                        }
                                                                                    </ul>
                                                                                </div>
                                                                            }
                                                                        </Link>
                                                                    </li>
                                                                )
                                                            })
                                                        }
                                                    </ul>
                                                </div>
                                            }
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>

                    <div className="col_3 w-[20%] flex justify-end !hidden lg:!block">
                        <p className='text-[10px] font-[500] flex items-center gap-2 mb-0 mt-0'>
                            <GoRocket />
                            Free International Delivery </p>
                    </div>
                </div>
            </nav>

            {/* Control Panels components */}
            {
                catData?.length !== 0 &&
                <CategoryPanel
                    isOpenCatPanel={isOpenCatPanel}
                    setIsOpenCatPanel={setIsOpenCatPanel}
                    propsSetIsOpenCatPanel={props?.setIsOpenCatPanel}
                    data={catData}
                />
            }

            {
                context?.windowWidth <= 992 && <MobileNav />
            }

        </>
    )
}

export default Navigation;