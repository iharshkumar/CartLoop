import { Button, Checkbox } from '@mui/material'
import React, { useContext, useState } from 'react'
import { MdOutlineModeEdit } from "react-icons/md";
import { GoTrash } from "react-icons/go";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { IoBagAddOutline } from "react-icons/io5";
import { MyContext } from '../../App';
import { useEffect } from 'react';
import { deleteData, deleteMultipleData, fetchDataFromApi } from '../../utils/api';


const columns =
    [
        { id: 'image', label: 'IMAGE', minWidth: 150 },
        { id: 'action', label: 'ACTION', minWidth: 100 },
    ];

const BannerV1List = () => {
    const [slidesData, setSlidesData] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [sortedIds, setSortedIds] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const context = useContext(MyContext)

    useEffect(() => {
        getData();
    }, [context?.isOpenFullScreenPanel])

    const handleSelectAll = (e) => {
        const isChecked = e.target.checked;
        const updatedItems = slidesData.map((item) => ({
            ...item,
            checked: isChecked,
        }));
        setSlidesData(updatedItems);

        if (isChecked) {
            const ids = updatedItems.map((item) => item._id).sort((a, b) => a - b)
            setSortedIds(ids);
        } else {
            setSortedIds([]);
        }
    }

    const getData = () => {
        fetchDataFromApi("/api/bannerV1").then((res) => {
            let arr = [];
            if (res?.error === false) {
                for (let i = 0; i < res?.data?.length; i++) {
                    arr[i] = res?.data[i];
                    arr[i].checked = false;
                }
                setTimeout(() => {
                    setSlidesData(arr);
                    setIsLoading(false);
                }, 500);
            }
        })
    }

    const handleCheckboxChange = (e, id, index) => {
        const updatedItems = slidesData.map((item) =>
            item._id === id ? { ...item, checked: !item.checked } : item
        );
        setSlidesData(updatedItems);

        const selectedIds = updatedItems
            .filter((item) => item.checked)
            .map((item) => item._id)
            .sort((a, b) => a - b);
        setSortedIds(selectedIds);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const deleteSlide = (id) => {
        deleteData(`/api/bannerV1/${id}`).then((res) => {
            context?.alertBox("success", "Banner V1 deleted")
            getData();
        })
    }

    // const deleteMultipleSlide = () => {
    //     if (sortedIds.length === 0) {
    //         context?.alertBox("error", "Please select items to delete.");
    //         return
    //     }

    //     try {
    //         deleteMultipleData(`/api/bannerV1/deleteMultiple`, {
    //             data: { ids: sortedIds },
    //         }).then((res) => {
    //             getData();
    //             context.alertBox("success", "Product Deleted");
    //         })
    //     } catch (error) {
    //         context.alertBox("error", "Error deleting item")
    //     }
    // }


    return (
        <>
            <div className='flex items-center justify-between !px-2 !py-0 !mt-3'>
                <h1 className='text-[20px] font-[600]'>Banner List</h1>
                <div className='col w-[50%] !ml-auto flex items-center !justify-end gap-3 '>

                    <Button className='btn-blue !text-white btn-sm flex items-center btn gap-2'
                        onClick={() => context.setIsOpenFullScreenPanel({
                            open: true,
                            model: 'Add Banners V1'
                        })}>
                        <IoBagAddOutline />Add Banner
                    </Button>
                </div>
            </div>

            <div className='card !my-4 !pt-5 !shadow=md sm:rounded-lg !bg-white' >
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead >
                            <TableRow>
                                <TableCell width={50}>
                                    <Checkbox size='small'
                                        onChange={handleSelectAll}
                                        checked={slidesData?.length > 0 ? slidesData.every((item) => item.checked) : false} />
                                </TableCell>

                                {
                                    columns.map((column) => (
                                        <TableCell
                                            width={300}
                                            key={column.minWidth}
                                            align={column.align}
                                            style={{ minWidth: column.minWidth }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))
                                }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                slidesData?.length !== 0 && slidesData?.map((item, index) => {
                                    return (
                                        <TableRow>

                                            <TableCell >
                                                <Checkbox size='small'
                                                    checked={item.checked === true ? true : false}
                                                    onChange={(e) => handleCheckboxChange(e, item._id, index)} />
                                            </TableCell>

                                            <TableCell width={300}>
                                                <div className='flex items-center gap-4 w-[300px]'>
                                                    <div className='img !w-full !rounded-md !overflow-hidden group'>
                                                        <img src={item?.images[0]}
                                                            className='w-full group-hover:scale-105 transition-all'
                                                        />
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell width={50}>
                                                <div className='flex items-center gap-1'>
                                                    <Button className='!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]'
                                                        onClick={() => context.setIsOpenFullScreenPanel({
                                                            open: true,
                                                            model: 'Edit Banner V1',
                                                            id: item?._id
                                                        })}
                                                    >
                                                        <MdOutlineModeEdit className='text-[rgba(0,0,0,0.7)] text-[20px] ' />
                                                    </Button>
                                                    <Button className='!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]'
                                                        onClick={() => { deleteSlide(item?._id) }}>
                                                        <GoTrash className='text-[rgba(0,0,0,0.7)] text-[20px] ' />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={10}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </div>
        </>
    )
}

export default BannerV1List