import React, { useContext } from 'react';
import { LiaShippingFastSolid } from 'react-icons/lia';
import { BiSupport } from "react-icons/bi";
import { LiaGiftSolid } from "react-icons/lia";
import { IoWalletOutline } from "react-icons/io5";
import { TbTruckReturn } from "react-icons/tb";
import { Link } from 'react-router-dom';
import { IoChatboxOutline } from 'react-icons/io5';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { CiFacebook } from "react-icons/ci";
import { RiTwitterXLine } from "react-icons/ri";
import { CiYoutube } from "react-icons/ci";
import { FaPinterest } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import Drawer from '@mui/material/Drawer';
import CartPanel from "../CartPanel";
import { MyContext } from '../../App.jsx';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { ProductZoom } from "../ProductZoom/index.jsx";
import ProductDetailsComponents from "../ProductDetails/index.jsx";


const Footer = () => {
    const context = useContext(MyContext)
    return (
        <>
            <footer className='bg-white w-full border-t border-[rgba(0,0,0,0.1)] pt-12 md:pt-16' style={{ paddingTop: '50px' }}>
                <div className='container w-full'>
                    <div className='flex flex-wrap items-center bg-white justify-center gap-6 md:gap-8 pb-8' style={{ paddingTop: '10px', paddingBottom: '20px' }}>
                        <div className='col flex items-center justify-center flex-col group w-full sm:w-[35%] md:w-[18%] mb-4 md:mb-0'>
                            <LiaShippingFastSolid className='text-[40px] transition-all duration-300 group-hover:!text-red-500 group-hover:-translate-y-1' />
                            <h3 className='text-[16px] font-[600] mt-3'>
                                Free Shipping
                            </h3>
                            <p className='text-[12px] font-[500]'>For all Orders Over $20</p>
                        </div>

                        <div className='col flex items-center justify-center flex-col group w-full sm:w-[35%] md:w-[18%] mb-4 md:mb-0'>
                            <TbTruckReturn className='text-[40px] transition-all duration-300 group-hover:!text-red-500 group-hover:-translate-y-1' />
                            <h3 className='text-[16px] font-[600] mt-3'>
                                30 Days Returns
                            </h3>
                            <p className='text-[12px] font-[500]'>For an Exchange Product</p>
                        </div>
                        <div className='col flex items-center justify-center flex-col group w-full sm:w-[35%] md:w-[18%] mb-4 md:mb-0'>
                            <IoWalletOutline className='text-[40px] transition-all duration-300 group-hover:!text-red-500 group-hover:-translate-y-1' />
                            <h3 className='text-[16px] font-[600] mt-3'>
                                Secured Payment
                            </h3>
                            <p className='text-[12px] font-[500]'>Payment Cards Accepted</p>
                        </div>
                        <div className='col flex items-center justify-center flex-col group w-full sm:w-[35%] md:w-[18%] mb-4 md:mb-0'>
                            <LiaGiftSolid className='text-[40px] transition-all duration-300 group-hover:!text-red-500 group-hover:-translate-y-1' />
                            <h3 className='text-[16px] font-[600] mt-3'>
                                Special Gifts
                            </h3>
                            <p className='text-[12px] font-[500]'>Our First Product Order</p>
                        </div>
                        <div className='col flex items-center justify-center flex-col group w-full sm:w-[35%] md:w-[15%] mb-4 md:mb-0'>
                            <BiSupport className='text-[40px] transition-all duration-300 group-hover:!text-red-500 group-hover:-translate-y-1' />
                            <h3 className='text-[16px] font-[600] mt-3'>
                                Support 24/7
                            </h3>
                            <p className='text-[12px] font-[500]'>Contact us Anytime</p>
                        </div>



                    </div>

                    <hr className='mt-8 mb-12 md:mb-16' />

                    <div className='footer flex flex-col md:flex-row items-start md:items-start gap-8 md:gap-8 py-6 pb-12 md:pb-16' style={{ paddingTop: '15px', paddingBottom: '30px' }}>
                        <div className='part1 w-full md:w-[25%] md:border-r border-[rgba(0,0,0,0.1)] md:pr-8'>
                            <h2 className='text-[18px] font-[600] mb-4'>
                                Contact us
                            </h2>
                            <p className='text-[13px] font-[400] mb-3 leading-relaxed'>
                                ClassShop - Mega Super Store<br />
                                Mandya, Karnataka<br />
                                India
                            </p>
                            <Link className='link text-[13px] block mb-4 hover:text-red-500 transition-colors' to="mailto:someone@example.com">harsh@company.com</Link>
                            <span className='text-[22px] font-[600] block w-full mb-6 !text-red-500'>
                                (+91) 8292035874
                            </span>

                            <div className='flex items-center gap-3 mt-4' style={{ paddingTop: '20px' }}>
                                <IoChatboxOutline className='text-[40px] !text-red-500 flex-shrink-0' />
                                <span className='text-[16px] font-[600] leading-relaxed'>
                                    Online Chat<br />
                                    <span className='text-[13px] font-[400] text-gray-600'>Get Expert Help</span>
                                </span>
                            </div>
                        </div>


                        <div className='part2 w-full md:w-[40%] flex flex-col md:flex-row gap-8 md:gap-10'>
                            <div className="part2_col1 w-full md:w-[50%]">
                                <h2 className='text-[18px] font-[600] mb-4'>
                                    Products
                                </h2>

                                <ul className='list space-y-3'>
                                    <li className='list-none text-[14px] w-full'><Link to="/" className='link hover:text-red-500 transition-colors'>Prices Drop</Link></li>
                                    <li className='list-none text-[14px] w-full'><Link to="/" className='link hover:text-red-500 transition-colors'>New Products</Link></li>
                                    <li className='list-none text-[14px] w-full'><Link to="/" className='link hover:text-red-500 transition-colors'>Best Deals</Link></li>
                                    <li className='list-none text-[14px] w-full'><Link to="/" className='link hover:text-red-500 transition-colors'>Contact us</Link></li>
                                    <li className='list-none text-[14px] w-full'><Link to="/" className='link hover:text-red-500 transition-colors'>Sitemap</Link></li>
                                    <li className='list-none text-[14px] w-full'><Link to="/" className='link hover:text-red-500 transition-colors'>Stores</Link></li>
                                </ul>
                            </div>

                            <div className="part2_col2 w-full md:w-[50%]">
                                <h2 className='text-[18px] font-[600] mb-4'>
                                    Our Company
                                </h2>

                                <ul className='list space-y-3'>
                                    <li className='list-none text-[14px] w-full'><Link to="/" className='link hover:text-red-500 transition-colors'>Delivery</Link></li>
                                    <li className='list-none text-[14px] w-full'><Link to="/" className='link hover:text-red-500 transition-colors'>Legal Notice</Link></li>
                                    <li className='list-none text-[14px] w-full'><Link to="/" className='link hover:text-red-500 transition-colors'>Terms & Conditions</Link></li>
                                    <li className='list-none text-[14px] w-full'><Link to="/" className='link hover:text-red-500 transition-colors'>About Us</Link></li>
                                    <li className='list-none text-[14px] w-full'><Link to="/" className='link hover:text-red-500 transition-colors'>Secure Payment</Link></li>
                                    <li className='list-none text-[14px] w-full'><Link to="/" className='link hover:text-red-500 transition-colors'>Login</Link></li>
                                </ul>
                            </div>

                        </div>

                        <div className='part2 w-full md:w-[35%] flex flex-col'>
                            <h2 className='text-[18px] font-[600] mb-4'>
                                Subscribe To Newsletter
                            </h2>
                            <p className='text-[13px] mb-5 leading-relaxed'>Subscribe to our latest newsletter to get news about special discounts.</p>

                            <form className='flex flex-col gap-4'>
                                <input type="text" className='w-full h-[45px] border outline-none pl-4 rounded-sm focus:border-red-500 transition-colors'
                                    placeholder='Your Email Address' />
                                <Button className='btn-org w-full md:w-auto'>Subscribe</Button>
                                <FormControlLabel
                                    control={<Checkbox />}
                                    label="I agree to the terms and conditions and the privacy policy"
                                    className='text-[12px]'
                                />
                            </form>
                        </div>

                    </div>

                </div>
            </footer>


            <div className='bottomStrip border-t border-[rgba(0,0,0,0.1)] bg-white py-6' style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                <div className='container flex flex-col md:flex-row items-center justify-between gap-6'>
                    <ul className='flex items-center gap-3'>
                        <li className='list-none'><Link to="/" target="_blank" className='!w-[35px] !h-[35px] rounded-full border border-[rgba(0,0,0,0.1)] 
                        flex items-center justify-center group hover:bg-red-500 transition-all'>
                            <CiFacebook className='text-[20px] group-hover:text-white' />
                        </Link>

                        </li>

                        <li className='list-none'><Link to="/" target="_blank" className='!w-[35px] !h-[35px] rounded-full border border-[rgba(0,0,0,0.1)] 
                        flex items-center justify-center group hover:bg-red-500 transition-all'>
                            <RiTwitterXLine className='text-[20px] group-hover:text-white' />
                        </Link>

                        </li>

                        <li className='list-none'><Link to="/" target="_blank" className='!w-[35px] !h-[35px] rounded-full border border-[rgba(0,0,0,0.1)] 
                        flex items-center justify-center group hover:bg-red-500 transition-all'>
                            <CiYoutube className='text-[20px] group-hover:text-white' />
                        </Link>

                        </li>

                        <li className='list-none'><Link to="/" target="_blank" className='!w-[35px] !h-[35px] rounded-full border border-[rgba(0,0,0,0.1)] 
                        flex items-center justify-center group hover:bg-red-500 transition-all'>
                            <FaPinterest className='text-[20px] group-hover:text-white' />
                        </Link>

                        </li>

                        <li className='list-none'><Link to="/" target="_blank" className='!w-[35px] !h-[35px] rounded-full border border-[rgba(0,0,0,0.1)] 
                        flex items-center justify-center group hover:bg-red-500 transition-all'>
                            <FaInstagram className='text-[20px] group-hover:text-white' />
                        </Link>

                        </li>
                    </ul>

                    <p className='text-[13px] text-center mb-0 order-3 md:order-2'>
                        © 2025 - Ecommerce Template
                    </p>
                    <div className='flex items-center gap-2 order-2 md:order-3'>
                        <img src="/card1.png" alt='image' />
                        <img src="/card2.png" alt='image' />
                        <img src="/card3.png" alt='image' />
                        <img src="/card4.png" alt='image' />
                        <img src="/card5.png" alt='image' />
                    </div>
                </div>
            </div>


            {/*Cart Panel*/}
            <Drawer open={context.openCartPanel} onClose={() => context.setOpenCartPanel(false)} anchor={"right"}
                className="cartPanel">
                <div className='flex flex-col h-full max-h-screen overflow-hidden'>
                    <div className="flex items-center justify-between !py-3 !px-4 gap-3 border-b border-[rgba(0,0,0,0.1)] flex-shrink-0">
                        <h4>Shopping Cart ({context?.cartData?.length})</h4>
                        <IoCloseSharp className="text-[20px] cursor-pointer" onClick={() => context.setOpenCartPanel(false)} />
                    </div>

                    {
                        context?.cartData?.length !== 0 ? <CartPanel data={context?.cartData} /> :
                            <>
                                <div className='flex items-center justify-center flex-col h-full'>
                                    <img src="/empty-cart.png" className='w-[150px] h-[150px] !mb-0' />
                                    <p className='text-[14px] font-[500] text-[rgba(0,0,0,0.7)] !mt-0'>Cart is empty</p>
                                    <Button className="btn-org btn-sm !mt-4"
                                        onClick={() => context.setOpenCartPanel(false)}>
                                        Continue Shopping
                                    </Button>
                                </div>
                            </>
                    }
                </div>
            </Drawer>

            <Dialog
                open={context?.openProductDetailsModal.open}
                fullWidth={context?.fullWidth}
                maxWidth={context?.maxWidth}
                onClose={context?.handleCloseProductDetailsModal}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                className="productDetailModal"
            >

                <DialogContent>
                    <div className="flex items-center w-full productDetailModalContainer relative">
                        <Button className="w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-[#000]
             !absolute top-[15px] right-[15px] !bg-[#f1f1f1]" onClick={context?.handleCloseProductDetailsModal}>
                            <IoCloseSharp className="text-[20px]" />
                        </Button>

                        {
                            context?.openProductDetailsModal?.item?.length !== 0 &&
                            <>
                                <div className="col1 w-[40%] !mt-4 !h-[480px] !pl-3 !pr-2">
                                    <ProductZoom images={context?.openProductDetailsModal?.item?.images} className='w-full' />
                                </div>

                                <div className="col2 w-[60%] !py-5 !px-8 !pr-16 productContent overflow-y-auto max-h-[70vh]">
                                    <ProductDetailsComponents item={context?.openProductDetailsModal?.item} />
                                </div>

                            </>
                        }

                    </div>
                </DialogContent>
            </Dialog>

        </>
    )
}

export default Footer;