import React, { useContext } from 'react';
import { LiaShippingFastSolid } from 'react-icons/lia';
import { BiSupport } from "react-icons/bi";
import { LiaGiftSolid } from "react-icons/lia";
import { IoWalletOutline } from "react-icons/io5";
import { TbTruckReturn } from "react-icons/tb";
import { Link } from 'react-router-dom';
import { IoChatboxOutline } from 'react-icons/io5';
import Button from '@mui/material/Button';
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
import FormControlLabel from '@mui/material/FormControlLabel';
import AddAddress from '../../Pages/MyAccount/addAddress.jsx';
import { Box } from '@mui/material';

const Footer = () => {
    const context = useContext(MyContext)

    return (
        <>
            <footer className='bg-white w-full border-t border-[rgba(0,0,0,0.1)] !pt-12 md:!pt-16' style={{ paddingTop: '50px' }}>
                <div className='container w-full'>
                    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4 !pb-8 !pt-4 md:!pt-[10px]'>
                        <div className='col flex items-center justify-center flex-col group text-center !p-4 rounded-2xl border border-gray-100 hover:border-red-100 hover:bg-red-50/40 transition-all duration-300'>
                            <span className='w-[52px] h-[52px] flex items-center justify-center rounded-full bg-red-50 group-hover:bg-red-100 transition-all duration-300 !mb-3'>
                                <LiaShippingFastSolid className='text-[26px] text-red-500 transition-all duration-300 group-hover:-translate-y-0.5' />
                            </span>
                            <h3 className='text-[13px] md:text-[14px] font-[700] leading-tight'>Free Shipping</h3>
                            <p className='text-[11px] font-[400] text-gray-400 !mt-1 leading-snug'>For all Orders Over $30</p>
                        </div>

                        <div className='col flex items-center justify-center flex-col group text-center !p-4 rounded-2xl border border-gray-100 hover:border-red-100 hover:bg-red-50/40 transition-all duration-300'>
                            <span className='w-[52px] h-[52px] flex items-center justify-center rounded-full bg-red-50 group-hover:bg-red-100 transition-all duration-300 !mb-3'>
                                <TbTruckReturn className='text-[26px] text-red-500 transition-all duration-300 group-hover:-translate-y-0.5' />
                            </span>
                            <h3 className='text-[13px] md:text-[14px] font-[700] leading-tight'>30 Days Returns</h3>
                            <p className='text-[11px] font-[400] text-gray-400 !mt-1 leading-snug'>For an Exchange Product</p>
                        </div>

                        <div className='col flex items-center justify-center flex-col group text-center !p-4 rounded-2xl border border-gray-100 hover:border-red-100 hover:bg-red-50/40 transition-all duration-300'>
                            <span className='w-[52px] h-[52px] flex items-center justify-center rounded-full bg-red-50 group-hover:bg-red-100 transition-all duration-300 !mb-3'>
                                <IoWalletOutline className='text-[26px] text-red-500 transition-all duration-300 group-hover:-translate-y-0.5' />
                            </span>
                            <h3 className='text-[13px] md:text-[14px] font-[700] leading-tight'>Secured Payment</h3>
                            <p className='text-[11px] font-[400] text-gray-400 !mt-1 leading-snug'>Payment Cards Accepted</p>
                        </div>

                        <div className='col flex items-center justify-center flex-col group text-center !p-4 rounded-2xl border border-gray-100 hover:border-red-100 hover:bg-red-50/40 transition-all duration-300'>
                            <span className='w-[52px] h-[52px] flex items-center justify-center rounded-full bg-red-50 group-hover:bg-red-100 transition-all duration-300 !mb-3'>
                                <LiaGiftSolid className='text-[26px] text-red-500 transition-all duration-300 group-hover:-translate-y-0.5' />
                            </span>
                            <h3 className='text-[13px] md:text-[14px] font-[700] leading-tight'>Special Gifts</h3>
                            <p className='text-[11px] font-[400] text-gray-400 !mt-1 leading-snug'>Our First Product Order</p>
                        </div>

                        <div className='col sm:col-span-1 col-span-2 flex items-center justify-center flex-col group text-center !p-4 rounded-2xl border border-gray-100 hover:border-red-100 hover:bg-red-50/40 transition-all duration-300'>
                            <span className='w-[52px] h-[52px] flex items-center justify-center rounded-full bg-red-50 group-hover:bg-red-100 transition-all duration-300 !mb-3'>
                                <BiSupport className='text-[26px] text-red-500 transition-all duration-300 group-hover:-translate-y-0.5' />
                            </span>
                            <h3 className='text-[13px] md:text-[14px] font-[700] leading-tight'>Support 24/7</h3>
                            <p className='text-[11px] font-[400] text-gray-400 !mt-1 leading-snug'>Contact us Anytime</p>
                        </div>
                    </div>

                    <hr className='!mt-8 !mb-6' />

                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 !py-10'>
                        <div className='flex flex-col gap-3'>
                            <h2 className='text-[15px] font-[700] uppercase tracking-widest text-gray-800 !mb-1'>Contact Us</h2>
                            <p className='text-[13px] text-gray-500 leading-relaxed'>
                                ClassyShop Mega Super Store<br />
                                Mandya, Karnataka, India
                            </p>
                            <Link className='text-[13px] text-gray-600 hover:text-red-500 transition-colors' to="mailto:harsh@company.com">harsh@company.com</Link>
                            <span className='text-[18px] font-[700] text-red-500'>(+91) 8292035874</span>
                            <div className='flex items-center gap-3 !mt-2 bg-red-50 rounded-xl !p-3'>
                                <IoChatboxOutline className='text-[28px] text-red-500 flex-shrink-0' />
                                <span className='text-[14px] font-[600] leading-tight'>
                                    Online Chat<br />
                                    <span className='text-[12px] font-[400] text-gray-500'>Get Expert Help</span>
                                </span>
                            </div>
                        </div>


                        <div className='flex flex-col gap-3'>
                            <h2 className='text-[15px] font-[700] uppercase tracking-widest text-gray-800 !mb-2'>Products</h2>
                            <ul className='space-y-2 !p-0'>
                                {['Prices Drop', 'New Products', 'Best Deals', 'Contact Us', 'Sitemap', 'Stores'].map(link => (
                                    <li key={link} className='list-none'>
                                        <Link to="/" className='text-[13px] text-gray-500 hover:text-red-500 transition-colors flex items-center gap-1.5 group'>
                                            <span className='w-1 h-1 rounded-full bg-red-400 opacity-0 group-hover:opacity-100 transition-opacity'></span>
                                            {link}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className='flex flex-col gap-3'>
                            <h2 className='text-[15px] font-[700] uppercase tracking-widest text-gray-800 !mb-2'>Our Company</h2>
                            <ul className='space-y-2 !p-0'>
                                {['Delivery', 'Legal Notice', 'Terms & Conditions', 'About Us', 'Secure Payment', 'Login'].map(link => (
                                    <li key={link} className='list-none'>
                                        <Link to="/" className='text-[13px] text-gray-500 hover:text-red-500 transition-colors flex items-center gap-1.5 group'>
                                            <span className='w-1 h-1 rounded-full bg-red-400 opacity-0 group-hover:opacity-100 transition-opacity'></span>
                                            {link}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className='flex flex-col gap-4'>
                            <h2 className='text-[15px] font-[700] uppercase tracking-widest text-gray-800 !mb-1'>Newsletter</h2>
                            <p className='text-[13px] text-gray-500 leading-relaxed'>Get the latest deals & news straight to your inbox.</p>
                            <form className='flex flex-col gap-3'>
                                <input type="text"
                                    className='w-full h-[44px] border border-gray-200 outline-none !pl-4 rounded-lg text-[13px] focus:border-red-400 transition-colors'
                                    placeholder='Your email address' />
                                <button type="submit" className='w-full h-[44px] rounded-lg text-[13px] font-[700] text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all shadow-md shadow-red-200'>
                                    Subscribe Now
                                </button>
                                <FormControlLabel
                                    control={<Checkbox size="small" />}
                                    label={<span className='text-[11px] text-gray-400'>I agree to the privacy policy & terms</span>}
                                    className='!ml-0 !mt-0'
                                />
                            </form>
                        </div>
                    </div>
                </div>
            </footer>


            <div className='bottomStrip border-t border-black/10 bg-white !py-5'>
                <div className='container flex flex-col md:flex-row items-center justify-between gap-4'>
                    <ul className='flex items-center gap-2'>
                        {[
                            { icon: <CiFacebook className='text-[18px]' /> },
                            { icon: <RiTwitterXLine className='text-[16px]' /> },
                            { icon: <CiYoutube className='text-[18px]' /> },
                            { icon: <FaPinterest className='text-[16px]' /> },
                            { icon: <FaInstagram className='text-[16px]' /> },
                        ].map((item, i) => (
                            <li key={i} className='list-none'>
                                <Link to="/" target="_blank" className='w-[34px] h-[34px] rounded-full border flex items-center justify-center hover:border-red-500 hover:bg-red-500/10 transition-all'>
                                    {item.icon}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <p className='text-[12px] text-white/40 !mb-0 order-3 md:order-2'>
                        © 2025 ClassyShop. All rights reserved.
                    </p>

                    <div className='flex items-center gap-2 order-2 md:order-3 opacity-60'>
                        <img src="/card1.png" alt='Visa' className='h-5 object-contain' />
                        <img src="/card2.png" alt='MC' className='h-5 object-contain' />
                        <img src="/card3.png" alt='Amex' className='h-5 object-contain' />
                        <img src="/card4.png" alt='PayPal' className='h-5 object-contain' />
                        <img src="/card5.png" alt='Stripe' className='h-5 object-contain' />
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


            {/*Address Panel*/}
            <Drawer open={context.openAddressPanel} onClose={() => context.setOpenAddressPanel(false)} anchor={"right"}
                className="addressPanel">
                <div className='flex flex-col h-full max-h-screen overflow-hidden'>
                    <div className="flex items-center justify-between !py-3 !px-4 gap-3 border-b border-[rgba(0,0,0,0.1)] flex-shrink-0">
                        <h4>{context?.editId ? "Edit" : "Add"} Delivery Address</h4>
                        <IoCloseSharp className="text-[20px] cursor-pointer" onClick={() => context.setOpenAddressPanel(false)} />
                    </div>


                    <div className="flex-grow overflow-y-auto !p-4">
                        <AddAddress />
                    </div>

                </div>

            </Drawer>

            {/* ===== Responsive Product Details Modal ===== */}
            <Dialog
                open={context?.openProductDetailsModal.open}
                fullWidth
                maxWidth="md"
                onClose={context?.handleCloseProductDetailsModal}
                aria-labelledby="product-detail-dialog-title"
                className="productDetailModal"
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: '16px',
                            overflow: 'hidden',
                            m: { xs: 1, sm: 2 },
                            maxHeight: { xs: '92vh', sm: '90vh' },
                            width: '100%',
                            position: 'relative',
                        }
                    }
                }}
            >
                <DialogContent
                    sx={{
                        padding: '0px !important',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        height: { xs: '92vh', md: 'auto' },
                    }}
                >
                    <Button
                        sx={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            zIndex: 100,
                            width: '36px',
                            height: '36px',
                            minWidth: '36px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            color: '#000',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            '&:hover': { backgroundColor: 'rgba(255,255,255,1)' }
                        }}
                        onClick={context?.handleCloseProductDetailsModal}
                    >
                        <IoCloseSharp style={{ fontSize: '18px' }} />
                    </Button>

                    {context?.openProductDetailsModal?.item?.length !== 0 && (
                        <>
                            <Box
                                sx={{
                                    display: { xs: 'flex', md: 'none' },
                                    flexDirection: 'column',
                                    overflowY: 'auto',
                                    height: '100%',
                                }}
                            >
                                <Box className="!p-3 !px-2 "
                                    sx={{
                                        width: '100%',
                                        height: '320px',
                                        flexShrink: 0,
                                        overflow: 'hidden',
                                        position: 'relative',
                                    }}
                                >
                                    <ProductZoom
                                        images={context?.openProductDetailsModal?.item?.images}
                                        style={{ width: '100%', height: '100%', display: 'block' }}
                                    />
                                </Box>

                                {/* Details — rendered BELOW image, not over it */}
                                <Box
                                    sx={{
                                        p: 2,
                                        pb: 5,
                                        backgroundColor: '#fff',
                                        position: 'relative', // break any stacking context bleed
                                        zIndex: 1,
                                    }}
                                >
                                    <ProductDetailsComponents item={context?.openProductDetailsModal?.item} />
                                </Box>
                            </Box>

                            {/* ── DESKTOP layout ── */}
                            <Box
                                sx={{
                                    display: { xs: 'none', md: 'flex' },
                                    flexDirection: 'row',
                                    minHeight: 0,
                                }}
                            >
                                <Box className="!p-3 !px-2 "
                                    sx={{
                                        width: '42%',
                                        flexShrink: 0,
                                        minHeight: '420px',
                                        maxHeight: '80vh',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <ProductZoom
                                        images={context?.openProductDetailsModal?.item?.images}
                                        style={{ width: '100%', height: '100%' }}
                                    />
                                </Box>

                                <Box className="!p-3 !px-2 "
                                    sx={{
                                        flex: 1,
                                        overflowY: 'auto',
                                        p: 3,
                                        pr: 5,
                                        maxHeight: '80vh',
                                    }}
                                >
                                    <ProductDetailsComponents item={context?.openProductDetailsModal?.item} />
                                </Box>
                            </Box>
                        </>
                    )}
                </DialogContent>
            </Dialog>

        </>
    )
}

export default Footer;
