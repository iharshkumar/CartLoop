import React from 'react';
import "../bannerBoxV2/style.css";
import { Link } from 'react-router-dom';
import { Padding } from '@mui/icons-material';

const BannerBoxV2 = (props) => {
    return (
        <div className='bannerBoxV2 w-full overflow-hidden rounded-md group relative '>
            <img src={props.image}
                className='w-full transition-all group-hover:!scale-103 group-hover:rotate-0' />
            <div className={`info absolute top-0 ${props.info?.toLowerCase() === "left" ? 'left-0 pl-1 py-4 md:pl-12 md:pr-6' : 'right-0 pr-4 pl-1 md:pr-12 md:pl-6'} pt-6 md:pt-12 pb-6 md:pb-12 w-[55%] h-full z-50 flex items-start justify-center flex-col gap-2 md:gap-4`}>
                <h2 className='text-[18px] md:text-[22px] lg:text-[25px] font-[700] text-black-300 leading-tight drop-shadow-lg' style={{paddingLeft:'20px'}}>
                    <span className='block'>{props?.item?.bannerTitle}</span>                    
                </h2>
                <span className='text-[16px] md:text-[20px] lg:text-[24px] text-red-500 font-[700] drop-shadow-md' style={{paddingLeft:'20px'}}>&#8377; {props?.item?.price}</span>
                <div className='pt-1 md:pt-2'>
                    <Link to={props.linkTo || "/"} className='text-[13px] md:text-[15px] font-[700] text-black uppercase tracking-wider hover:text-primary transition-colors duration-300 underline decoration-2 underline-offset-4 link ' style={{paddingLeft:'20px'}}>
                        {props.linkText || 'SHOP NOW'}
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default BannerBoxV2;