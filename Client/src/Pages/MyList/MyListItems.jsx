import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { IoCloseSharp } from "react-icons/io5";
import Rating from '@mui/material/Rating';
import { deleteData } from '../../utils/api.js';
import { MyContext } from '../../App.jsx';

const MyListItems = (props) => {
    const context = useContext(MyContext);

    const handleDeleteCart = () => {
        deleteData(`/api/myList/${props?.item?._id}`).then((res) => {
            if (res?.error === false) {
                context?.alertBox("success", res?.message);
                context?.getMyListData();
            }
        })
    }

    return (
        <div className='cartItem w-full !p-3 flex items-center gap-4 !pb-5 !border-b !border-[rgba(0,0,0.1)]'>
            <div className='img w-[15%] !h-[150px] !rounded-md !overflow-hidden'>
                <Link to={`/product/${props?.item?.productId}`} className="group">
                    <img src={props?.item?.image}
                        className='w-full group-hover:scale-105 transition-all' />
                </Link>
            </div>


            <div className='info w-[85%] relative '>
                <IoCloseSharp className='cursor-pointer absolute  top-[0px] right-[0px] text-[22px] link transition-all' onClick={() => handleDeleteCart(props?.item?._id)} />

                <span className='text-[14px] !mb-1'>{props?.item?.brand}</span>
                <h3>
                    <Link to={`/product/${props?.item?.productId}`}
                        className='text-[15px] link !mb-1'>{props?.item?.productTitle?.substr(0, 50) + '...'}
                    </Link>
                </h3>

                <Rating className='!mt-1' name="size-small" value={props?.item?.rating} size="small" readOnly />

                <div className='flex items-center gap-4 !mt-5 !mb-3'>
                    <span className='price text-[15px] font-[600]'>
                        &#8377;{props?.item?.price}
                    </span>

                    <span className='oldPrice line-through text-gray-500 text-[15px] font-[500]'>
                        &#8377;{props?.item?.oldPrice}
                    </span>

                    <span className='price text-[#f15252] text-[15px] font-[600]'>
                        {props?.item?.discount}% OFF
                    </span>
                </div>

            </div>
        </div>
    )
}

export default MyListItems;