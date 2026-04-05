import React from 'react';
import { IoMdTime } from "react-icons/io"
import { Link } from 'react-router-dom';
import { IoIosArrowForward } from 'react-icons/io';

const BlogItem = (props) => {
    // Helper to strip HTML tags for a clean text preview
    const getPlainPreview = (html) => {
        if (!html) return "";
        return html.replace(/<[^>]*>?/gm, '');
    };

    return (
        <div className='blogItem group h-full flex flex-col' style={{ paddingTop: '20px' }}>
            <Link to={`/blog/${props?.item?._id}`} className='imgWrapper block w-full overflow-hidden rounded-[20px] cursor-pointer relative group'>
                <img src={props?.item?.images[0]}
                    className='w-full h-[220px] object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1' alt='blog image' />
                <span className='flex items-center justify-center text-white absolute bottom-[15px] right-[15px] z-50 bg-red-500/90 backdrop-blur-sm !px-3 !py-1 rounded-full text-[11px] font-[600] gap-1 shadow-lg'>
                    <IoMdTime className='text-[14px] ' /> {props?.item?.createdAt?.split("T")[0]}
                </span>
            </Link>
            <div className='info !py-5 flex flex-col flex-grow text-left'>
                <h2 className='text-[17px] font-[700] text-gray-900 leading-tight !mb-3 line-clamp-2 min-h-[42px]'>
                    <Link to={`/blog/${props?.item?._id}`} className='hover:text-red-500 transition-colors duration-300'>
                        {props?.item?.title.substring(0, 50) + "..."}
                    </Link>
                </h2>
                <div className='text-[14px] font-[400] text-gray-600 !mb-5 line-clamp-3 leading-relaxed flex-grow'>
                    {getPlainPreview(props?.item?.description)}
                </div>
                <Link to={`/blog/${props?.item?._id}`} className='group/btn inline-flex items-center gap-2 text-[12px] font-[800] uppercase tracking-widest text-gray-900 hover:text-red-500 transition-all duration-300 mt-auto'>
                    Read more
                    <IoIosArrowForward className="transition-transform group-hover/btn:translate-x-1" />
                </Link>
            </div>
        </div>
    )
}

export default BlogItem;