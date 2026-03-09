import { Button } from '@mui/material'
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
import { deleteData, fetchDataFromApi } from '../../utils/api';

const columns =
    [
        { id: 'image', label: 'IMAGE', minWidth: 150 },
        { id: 'action', label: 'ACTION', minWidth: 100 },
    ];

const AdsBannerV2List = () => {
    const [slidesData, setSlidesData] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false)
    const context = useContext(MyContext)

    useEffect(() => {
        getData();
    }, [context?.isOpenFullScreenPanel])

    const getData = () => {
        fetchDataFromApi("/api/adsBannerV2").then((res) => {
            let arr = [];
            if (res?.error === false) {
                for (let i = 0; i < res?.data?.length; i++) {
                    arr[i] = res?.data[i];
                }
                setTimeout(() => {
                    setSlidesData(arr);
                    setIsLoading(false);
                }, 500);
            }
        })
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const deleteSlide = (id) => {
        deleteData(`/api/adsBannerV2/${id}`).then((res) => {
            context?.alertBox("success", "Ads Banner V2 deleted")
            getData();
        })
    }

    return (
        <>
            <div className='flex items-center justify-between !px-2 !py-0 !mt-3'>
                <h1 className='text-[20px] font-[600]'>Ads Banner V2 List</h1>
                <div className='col w-[50%] !ml-auto flex items-center !justify-end gap-3 '>

                    <Button className='btn-blue !text-white btn-sm flex items-center btn gap-2'
                        onClick={() => context.setIsOpenFullScreenPanel({
                            open: true,
                            model: 'Add Ads Banner V2'
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
                                        <TableRow key={index}>
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
                                                            model: 'Edit Ads Banner V2',
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

export default AdsBannerV2List

