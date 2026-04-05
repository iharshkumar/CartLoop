import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { IoCloseSharp } from 'react-icons/io5';
import { FaRegSquarePlus } from 'react-icons/fa6';
import { FiMinusSquare } from 'react-icons/fi';
import { MyContext } from '../../../App';
import { useContext } from 'react';
import { CategoryCollapse } from '../../CategoryCollapse';

const CategoryPanel = (props) => {
    const context = useContext(MyContext)
    const toggleDrawer = (newOpen) => () => {
        props.setIsOpenCatPanel(newOpen);
        props.propsSetIsOpenCatPanel(newOpen);
    }

    const DrawerList = (
        <Box sx={{ width: 300, paddingX: 2, paddingTop: 2 }} role="presentation" clasName="categoryPanel" >

            <h3 className='text-[20px] !py-2 !mb-2 font-[500] flex items-center justify-between gap-4'>
                Shop By Categories
                <IoCloseSharp onClick={toggleDrawer(false)} className='cursor-pointer text-[20px] p-2' />
            </h3>

            {
                props?.data?.length !== 0 && <CategoryCollapse data={props?.data} closePanel={toggleDrawer(false)} />
            }


            {
                context?.isLogin === true &&
                <>
                    <div className='flex flex-col gap-2 !mt-10 border-t border-[rgba(0,0,0,0.1)] pt-5'>
                        <h3 className='text-[18px] font-bold !mb-2'>Account</h3>
                        <Link to="/my-account" onClick={toggleDrawer(false)}>
                            <Button className='w-full !justify-start !text-black !text-[15px] !capitalize'>My Profile</Button>
                        </Link>
                        <Link to="/my-orders" onClick={toggleDrawer(false)}>
                            <Button className='w-full !justify-start !text-black !text-[15px] !capitalize'>My Orders</Button>
                        </Link>
                        <Button className='w-full !justify-start !text-[#ff5252] !text-[15px] !capitalize' onClick={() => { context.logout(); toggleDrawer(false)(); }}>Logout</Button>
                    </div>
                </>
            }

        </Box>
    );

    return (
        <>

            <Drawer open={props.isOpenCatPanel} onClose={toggleDrawer(false)}>
                {DrawerList}
            </Drawer>

        </>
    )
}

export default CategoryPanel;