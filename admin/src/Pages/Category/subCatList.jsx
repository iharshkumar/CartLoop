import { Button, Checkbox } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { BiExport } from "react-icons/bi";
import { IoBagAddOutline } from "react-icons/io5";
import { MyContext } from '../../App';
import { fetchDataFromApi } from '../../utils/api';
import { FaAngleDown } from 'react-icons/fa6';
import EditSubCatBox from './EditSubCatBox';


const SubCategoryList = () => {
    const [isOpen, setIsOpen] = useState(0);
    const context = useContext(MyContext)
    useEffect(() => {
        fetchDataFromApi("/api/category/").then((res) => {
            context?.setCatData(res?.data)
        })
    }, [context?.isOpenFullScreenPanel])


    const expend = (index) => {
        if (isOpen === index) {
            setIsOpen(!isOpen)
        }
        else {
            setIsOpen(index)
        }
    }
    return (
        <>
            <div className='flex items-center flex-col md:flex-row !justify-start md:!justify-between !px-2 !py-0 !mt-3'>
                <h1 className='text-[20px] font-[600] w-full md:w-[50%] !mb-2 md:!mb-0'>Sub Category List</h1>
                <div className='col !mr-auto md:!mr-0 md:!ml-auto flex items-center !justify-end gap-3 '>
                    <Button className='btn-blue !text-white btn-sm flex items-center btn gap-2'
                        onClick={() => context.setIsOpenFullScreenPanel({
                            open: true,
                            model: 'Add New Sub Category'
                        })}>
                        <IoBagAddOutline />Add New Sub Category
                    </Button>
                </div>
            </div>


            <div className='card !my-4 pt-5 !pb-5 !px-5 !shadow-md !sm:rounded-lg !bg-white'>

                {
                    context?.catData?.length !== 0 &&
                    <ul className='w-full'>
                        {
                            context?.catData?.map((firstLevelCat, index) => {
                                return (
                                    <li className='w-full !mb-1' key={index}>
                                        <div className='flex items-center w-full !p-2 !bg-[#f1f1f1] !rounded-sm !px-4'>
                                            <span className='font-[500] flex items-center gap-4 text-[14px]'>
                                                {firstLevelCat?.name}
                                            </span>

                                            <Button className='!min-w-[35px] !w-[35px] !h-[35px] !rounded-full !text-black !ml-auto'
                                                onClick={() => expend(index)}
                                            >
                                                <FaAngleDown />
                                            </Button>
                                        </div>
                                        {
                                            isOpen === index &&
                                            <>
                                                {
                                                    firstLevelCat?.children?.length !== 0 &&
                                                    <ul className='w-full'>
                                                        {
                                                            firstLevelCat?.children?.map((subCat, index_) => {
                                                                return (
                                                                    <li className='w-full !py-1 transition-all hover:bg-[#fafafa]' key={index_}>
                                                                        <EditSubCatBox
                                                                            name={subCat.name}
                                                                            id={subCat?._id}
                                                                            catData={context?.catData}
                                                                            index={index_}
                                                                            selectedCat={subCat?.parentId}
                                                                            selectedCatName={subCat?.parentCatName}
                                                                        />
                                                                        {
                                                                            subCat?.children?.length !== 0 &&
                                                                            <ul className='!pl-4'>
                                                                                {
                                                                                    subCat?.children?.map((thirdLevel, index__) => {
                                                                                        return (
                                                                                            <li
                                                                                                key={index__}
                                                                                                className='w-full transition-all hover:bg-[#fafafa]'>
                                                                                                <EditSubCatBox
                                                                                                    name={thirdLevel.name}
                                                                                                    catData={firstLevelCat?.children}
                                                                                                    index={index__}
                                                                                                    selectedCat={thirdLevel?.parentId}
                                                                                                    selectedCatName={thirdLevel?.parentCatName}
                                                                                                    id={thirdLevel?._id}
                                                                                                />
                                                                                            </li>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </ul>
                                                                        }
                                                                    </li>
                                                                )
                                                            })
                                                        }
                                                    </ul>
                                                }
                                            </>
                                        }

                                    </li>
                                )
                            })
                        }
                    </ul>
                }

            </div>


        </>
    )
}

export default SubCategoryList