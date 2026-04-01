import React, { useContext, useEffect, useState } from 'react';
import { Dialog, Button } from '@mui/material';
import { IoMdClose } from "react-icons/io";
import { FaTrashAlt } from "react-icons/fa";
import { MyContext } from '../../App';
import { fetchDataFromApi } from '../../utils/api';
import Rating from '@mui/material/Rating';
import { Link } from 'react-router-dom';

const CompareModal = () => {
    const context = useContext(MyContext);
    const { compareData, setCompareData, isCompareModalOpen, setIsCompareModalOpen, removeCompareItem, addToCompare } = context;

    const [relatedProducts, setRelatedProducts] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [loadingProducts, setLoadingProducts] = useState(false);

    useEffect(() => {
        if (isCompareModalOpen && compareData.length > 0) {
            fetchRelatedProducts();
        }
    }, [isCompareModalOpen, compareData.length]);

    const fetchRelatedProducts = async () => {
        try {
            setLoadingProducts(true);
            const catId = compareData[0]?.catId;
            const res = await fetchDataFromApi(`/api/product/getAllProductsByCatId/${catId}`);
            if (res?.error === false) {
                // Filter out products already in comparison
                const available = res.data.filter(p => !compareData.find(c => c._id === p._id));
                setRelatedProducts(available);
            }
        } catch (error) {
            console.error("Error fetching related products", error);
        } finally {
            setLoadingProducts(false);
        }
    };

    const handleClose = () => {
        setIsCompareModalOpen(false);
        setIsDropdownOpen(false);
        setCompareData([]);
    };

    const hasSizes = compareData.some(item => item.size?.length > 0);
    const hasRAM = compareData.some(item => item.productRam?.length > 0);
    const hasWeight = compareData.some(item => item.productWeight?.length > 0);

    return (
        <Dialog open={isCompareModalOpen} onClose={handleClose} maxWidth="lg" fullWidth>
            <div className="relative !p-6 bg-white rounded-lg">
                <div className="flex justify-between items-center border-b border-[rgba(0,0,0,0.1)] !pb-4 !mb-4">
                    <h2 className="text-[20px] font-[600]">Compare Products</h2>
                    <Button onClick={handleClose} className="!min-w-[40px] !w-[40px] !h-[40px] !rounded-full !text-gray-600 !bg-[#f1f1f1] hover:!bg-gray-200 transition-all">
                        <IoMdClose size={20} />
                    </Button>
                </div>

                {compareData.length === 0 ? (
                    <div className="text-center !py-10 text-[15px] text-gray-500 font-[500]">
                        No products added for comparison.
                    </div>
                ) : (
                    <div className="overflow-x-auto customScroll">
                        <table className="w-full border-collapse !min-w-[700px] min-h-[500px] text-left">
                            <tbody>
                                {/* Product Images & Basic Info Row */}
                                <tr>
                                    <td className="py-5 px-3 border-b border-[rgba(0,0,0,0.1)] font-[600] text-[15px] text-gray-800 w-32 align-top">Product</td>
                                    {compareData.map((item, index) => (
                                        <td key={index} className="py-5 px-3 border-b border-l border-[rgba(0,0,0,0.1)] text-center align-top relative min-w-[220px]">
                                            <button
                                                onClick={() => removeCompareItem(item._id)}
                                                className="absolute top-6 right-4 text-gray-400 hover:text-white w-8 h-8 flex items-center justify-center bg-gray-50 hover:bg-[#ff5252] rounded-full transition-all z-10 shadow-sm"
                                                title="Remove"
                                            >
                                                <FaTrashAlt size={13} />
                                            </button>
                                            <Link to={`/product/${item._id}`} onClick={handleClose} className="block group cursor-pointer">
                                                <div className="w-full h-[180px] mb-4 overflow-hidden rounded-md flex items-center justify-center p-2">
                                                    <img src={item.images?.[0]} alt={item.name} className="h-full object-contain group-hover:scale-105 transition-all" />
                                                </div>
                                                <h3 className="text-[15px] font-[500] line-clamp-2 md:text-md h-11 text-gray-800 !px-2 group-hover:text-[#ff5252] transition-colors">{item.name.substring(0, 30) + "..."}</h3>
                                            </Link>
                                        </td>
                                    ))}

                                    {/* Add Product Column Slot */}
                                    {compareData.length < 3 && (
                                        <td className="!py-5 !px-3 border-b border-l border-[rgba(0,0,0,0.1)] text-center align-middle min-w-[220px]">
                                            <div className="relative !px-2">
                                                <Button
                                                    className="!bg-[#f1f1f1] !text-gray-600 !w-full !py-4 hover:!bg-[#ff5252] hover:!text-white transition-all !rounded-md !capitalize !font-[500] border-dashed !border-2 !border-gray-300 hover:!border-[#ff5252]"
                                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                                >
                                                    {loadingProducts ? "Loading..." : "+ Add Product"}
                                                </Button>

                                                {/* Products Dropdown */}
                                                {isDropdownOpen && (
                                                    <div className="absolute top-16 left-2 right-2 bg-white border border-[rgba(0,0,0,0.1)] shadow-xl rounded-md z-50 max-h-[300px] overflow-y-auto text-left">
                                                        {relatedProducts.length === 0 ? (
                                                            <div className="!p-4 text-[13px] text-gray-500 text-center font-[500]">No other products found.</div>
                                                        ) : (
                                                            relatedProducts.map(p => (
                                                                <div
                                                                    key={p._id}
                                                                    className="!p-3 border-b border-[rgba(0,0,0,0.05)] hover:bg-gray-50 cursor-pointer flex items-center gap-3 group transition-all"
                                                                    onClick={() => {
                                                                        addToCompare(p);
                                                                        setIsDropdownOpen(false);
                                                                    }}
                                                                >
                                                                    <div className="w-12 h-12 bg-gray-50 rounded-sm overflow-hidden flex-shrink-0 border border-[rgba(0,0,0,0.1)] p-1">
                                                                        <img src={p.images?.[0]} alt={p.name} className="w-full h-full object-contain group-hover:scale-110 transition-all" />
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="!text-[13px] !font-[500] truncate group-hover:text-[#ff5252] text-gray-800">{p.name}</p>
                                                                        <p className="!text-[14px] !text-[#ff5252] !font-[600]">₹{p.price}</p>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>

                                {/* Price Row */}
                                <tr>
                                    <td className="!py-4 px-3 border-b border-[rgba(0,0,0,0.1)] font-[600] text-[15px] text-gray-800">Price</td>
                                    {compareData.map(item => (
                                        <td key={item._id} className="!py-4 px-3 border-b border-l border-[rgba(0,0,0,0.1)] text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <span className="text-[18px] font-[600] text-[#ff5252]">₹{item.price}</span>
                                                {item.oldPrice && <span className="text-[14px] font-[500] text-gray-400 line-through">₹{item.oldPrice}</span>}
                                            </div>
                                        </td>
                                    ))}
                                    {compareData.length < 3 && <td className="!py-4 px-3 border-b border-l border-[rgba(0,0,0,0.1)]"></td>}
                                </tr>

                                {/* Brand Row */}
                                <tr>
                                    <td className="!py-4 px-3 border-b border-[rgba(0,0,0,0.1)] font-[600] text-[15px] text-gray-800">Brand</td>
                                    {compareData.map(item => (
                                        <td key={item._id} className="!py-4 px-3 border-b border-l border-[rgba(0,0,0,0.1)] text-center text-[14px] font-[500] text-gray-600 uppercase">
                                            {item.brand || '-'}
                                        </td>
                                    ))}
                                    {compareData.length < 3 && <td className="!py-4 px-3 border-b border-l border-[rgba(0,0,0,0.1)]"></td>}
                                </tr>

                                {/* Rating Row */}
                                <tr>
                                    <td className="!py-4 px-3 border-b border-[rgba(0,0,0,0.1)] font-[600] text-[15px] text-gray-800">Rating</td>
                                    {compareData.map(item => (
                                        <td key={item._id} className="!py-4 px-3 border-b border-l border-[rgba(0,0,0,0.1)] text-center">
                                            <div className="flex flex-col items-center">
                                                <Rating value={item.rating || 0} precision={0.5} size="small" readOnly />
                                                <span className="text-[12px] font-[500] text-gray-500 mt-1">({item.rating || 0}/5)</span>
                                            </div>
                                        </td>
                                    ))}
                                    {compareData.length < 3 && <td className="py-4 px-3 border-b border-l border-[rgba(0,0,0,0.1)]"></td>}
                                </tr>

                                {/* Size/Variant Row */}
                                {hasSizes && (
                                    <tr>
                                        <td className="!py-4 !px-3 text-left border-b border-[rgba(0,0,0,0.1)] font-[600] text-[15px] text-gray-800">Sizes</td>
                                        {compareData.map(item => (
                                            <td key={item._id} className="!py-4 !px-3 border-b border-l border-[rgba(0,0,0,0.1)] text-center text-sm">
                                                {item.size?.length > 0 ? (
                                                    <div className="flex flex-wrap gap-2 justify-center">
                                                        {item.size.map((sz, i) => (
                                                            <span key={i} className="!px-3 !py-1 bg-white border border-[rgba(0,0,0,0.1)] shadow-sm text-[13px] font-[500] rounded-sm text-gray-700">{sz}</span>
                                                        ))}
                                                    </div>
                                                ) : <span className="text-gray-400 font-[500]">-</span>}
                                            </td>
                                        ))}
                                        {compareData.length < 3 && <td className="!py-4 !px-3 border-b border-l border-[rgba(0,0,0,0.1)]"></td>}
                                    </tr>
                                )}

                                {/* RAM Row */}
                                {hasRAM && (
                                    <tr>
                                        <td className="!py-4 !px-3 border-b border-[rgba(0,0,0,0.1)] font-[600] text-[15px] text-gray-800">RAM</td>
                                        {compareData.map(item => (
                                            <td key={item._id} className="!py-4 !px-3 border-b border-l border-[rgba(0,0,0,0.1)] text-center text-[14px] font-[500] text-gray-600">
                                                {item.productRam?.length > 0 ? item.productRam.join(', ') : <span className="text-gray-400">-</span>}
                                            </td>
                                        ))}
                                        {compareData.length < 3 && <td className="!py-4 !px-3 border-b border-l border-[rgba(0,0,0,0.1)]"></td>}
                                    </tr>
                                )}

                                {/* Weight Row */}
                                {hasWeight && (
                                    <tr>
                                        <td className="!py-4 !px-3 border-b-0 border-[rgba(0,0,0,0.1)] font-[600] text-[15px] text-gray-800">Weight</td>
                                        {compareData.map(item => (
                                            <td key={item._id} className="!py-4 !px-3 border-b-0 border-l border-[rgba(0,0,0,0.1)] text-center text-[14px] font-[500] text-gray-600">
                                                {item.productWeight?.length > 0 ? item.productWeight.join(', ') : <span className="text-gray-400">-</span>}
                                            </td>
                                        ))}
                                        {compareData.length < 3 && <td className="!py-4 !px-3 border-b-0 border-l border-[rgba(0,0,0,0.1)]"></td>}
                                    </tr>
                                )}

                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </Dialog>
    );
};

export default CompareModal;
