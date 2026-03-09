import React from 'react';
import { IoMdTime } from "react-icons/io"
import { Link } from 'react-router-dom';
import { IoIosArrowForward } from 'react-icons/io';

const BlogItem = (props) => {
    return (
        <div className='blogItem group' style={{ paddingTop: '20px' }}>
            <div className='imgWrapper w-full overflow-hidden rounded-md cusor-pointer relative'>
                <img src={props?.item?.images[0]}
                    className='w-full transition-all group-hover:scale-105 group-hover:rotate-1' alt='blog image' />
                <span className='flex items-center justify-center text-white absolute bottom-[15px] 
                right-[15px] z-50 bg-red-500 rounded-md text-[12px] font-[500] gap-1'>
                    <IoMdTime className='text-[16px] ' /> {props?.item?.createdAt?.split("T")[0]}
                </span>
            </div>
            <div className='info py-4'>
                <h2 className='text-[15px] font-[600] text-black'>
                    <Link to="/" className='link'>{props?.item?.title}
                    </Link>
                </h2>
                <p className='text-[13px] font-[400] text-[rgba(0,0,0,0.8)] mb-4'>
                    <div dangerouslySetInnerHTML={{ __html: props?.item?.description?.substr(0, 150) + '...' }} />
                </p>
                <Link className='link font-[500] text-[14px] flex items-center gap-1'>
                    Read more
                    <IoIosArrowForward />
                </Link>

            </div>

        </div>
    )
}

export default BlogItem;