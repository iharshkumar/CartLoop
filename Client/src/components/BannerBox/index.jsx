import React from 'react'
import { Link } from 'react-router-dom';
const BannerBox = (props) => {
    return (
        <div className='!mt-0 box bannerBox overflow-hidden rounded-lg group'style={{ paddingTop: '40px' }}>
            <Link to="/">
                <img 
                    src={props.img} 
                    className='w-full transition-all group-hover:scale-103 rounded-lg group-hover:rotate-0' 
                    alt='banner' 
                    loading="lazy"
                />
            </Link>
        </div>
    )
}
export default BannerBox;