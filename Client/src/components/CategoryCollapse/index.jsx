import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Button from '@mui/material/Button';
import { IoCloseSharp } from 'react-icons/io5';
import { FaRegSquarePlus } from 'react-icons/fa6';
import { FiMinusSquare } from 'react-icons/fi';

export const CategoryCollapse = (props) => {

    const [submenuIndex, setSubmenuIndex] = useState(null);
    const [innerSubmenuIndex, setInnerSubmenuIndex] = useState({ parent: null, child: null });


    const openSubmenu = (index) => {
        if (submenuIndex === index) {
            setSubmenuIndex(null);
            setInnerSubmenuIndex({ parent: null, child: null });
        } else {
            setSubmenuIndex(index);
            setInnerSubmenuIndex({ parent: null, child: null });
        };
    }

    const openInnerSubmenu = (parentIndex, childIndex) => {
        if (innerSubmenuIndex.parent === parentIndex && innerSubmenuIndex.child === childIndex) {
            setInnerSubmenuIndex({ parent: null, child: null });
        } else {
            setInnerSubmenuIndex({ parent: parentIndex, child: childIndex });
        };
    }


    return (
        <>
            <div className="scroll">
                <ul className="w-full space-y-4">
                    {
                        props?.data?.length !== 0 && props?.data?.map((cat, index) => {

                            return (
                                <li className="list-none" key={index}>
                                    <div className="flex items-center justify-between gap-2">
                                        <Link to={`/products?catId=${cat?._id}`} className="flex-1" onClick={props.closePanel}>
                                            <Button className="!px-1 !min-w-0 !text-left !justify-start !w-full !text-[rgba(0,0,0,2)]">
                                                {cat?.name}
                                            </Button>
                                        </Link>

                                        <button
                                            type="button"
                                            className="shrink-0"
                                            onClick={() => openSubmenu(index)}
                                            aria-label={submenuIndex === index ? "Collapse category" : "Expand category"}
                                        >
                                            {submenuIndex === index ? (
                                                <FiMinusSquare className="cursor-pointer" />
                                            ) : (
                                                <FaRegSquarePlus className="cursor-pointer" />
                                            )}
                                        </button>
                                    </div>

                                    {/* FIRST SUBMENU → AUTO EXPAND */}
                                    {submenuIndex === index && (
                                        <ul className="!pl-4 space-y-3">
                                            {
                                                cat?.children?.length !== 0 && cat?.children?.map((subCat, index_) => {
                                                    return (
                                                        <li className="list-none relative" key={index_}>
                                                            <div className="flex items-center justify-between ">
                                                                <Button className="!min-w-0 !text-left !text-[rgba(0,0,0,0.8)]">
                                                                    {subCat?.name}
                                                                </Button>

                                                                {innerSubmenuIndex.parent === index && innerSubmenuIndex.child === index_ ? (
                                                                    <FiMinusSquare className="cursor-pointer" onClick={() => openInnerSubmenu(index, index_)} />
                                                                ) : (
                                                                    <FaRegSquarePlus className="cursor-pointer" onClick={() => openInnerSubmenu(index, index_)} />
                                                                )}
                                                            </div>

                                                            {/* INNER SUBMENU → AUTO EXPAND */}
                                                            {innerSubmenuIndex.parent === index && innerSubmenuIndex.child === index_ && (
                                                                <ul className="!pl-4 text-[15px] !pb-3 ">
                                                                    {
                                                                        subCat?.children?.length !== 0 && subCat?.children?.map((thirdLevelCat, index__) => {
                                                                            return (
                                                                                <li className='list-none relative !mb-1' key={index__}>
                                                                                    <Link to={`/products?thirdLevelCatId=${thirdLevelCat?._id}`} className=" link w-full !text-left !justify-start !px-3 transition !text-[14px] block" onClick={props.closePanel}>
                                                                                        {thirdLevelCat?.name}
                                                                                    </Link>
                                                                                </li>
                                                                            )
                                                                        })
                                                                    }
                                                                </ul>
                                                            )}
                                                        </li>
                                                    )
                                                })
                                            }
                                        </ul>
                                    )}
                                </li>
                            )
                        })
                    }
                </ul>
            </div >
        </>
    )
}

export default CategoryCollapse;