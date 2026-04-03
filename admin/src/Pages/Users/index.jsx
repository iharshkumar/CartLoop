import { Button, Checkbox } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import SearchBox from '../../Components/SearchBox';
import { MyContext } from '../../App';
import { MdOutlineMail } from "react-icons/md";
import { FaPhone } from "react-icons/fa6";
import { CiCalendar } from "react-icons/ci";
import { deleteData, deleteMultipleData, fetchDataFromApi } from '../../utils/api';
import CircularProgress from '@mui/material/CircularProgress';
import Badge from '../../Components/Badge';

const columns =
    [
        {
            id: 'userImg',
            label: 'USER IMAGE',
            minWidth: 80
        },
        {
            id: 'userName',
            label: 'USER NAME',
            minWidth: 80
        },
        {
            id: 'userEmail',
            label: 'USER EMAIL',
            minWidth: 100
        },
        {
            id: 'userPh',
            label: 'USER PHONE NO',
            minWidth: 130
        },
        {
            id: "verifyemail",
            label: "VERIFY EMAIL",
            minWidth: 130
        },
        {
            id: 'createdDate',
            label: 'CREATED',
            minWidth: 130
        }
    ];

const Users = () => {
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [userData, setUserData] = useState([]);
    const [userTotalData, setUserTotalData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const context = useContext(MyContext);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const [sortedIds, setSortedIds] = useState([]);

    useEffect(() => {
        setIsLoading(true)
        fetchDataFromApi(`/api/user/getAllUsers`).then((res) => {
            if (res?.error === false) {
                setUserData(res?.users)
                setUserTotalData(res?.users)
                setIsLoading(false)
            }
        })
    }, []);

    useEffect(() => {
        if (searchQuery !== "") {
            setPage(0);
            const filteredUsers = userTotalData?.filter((user) =>
                user?._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user?.mobile?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
                user?.createdAt?.toString().includes(searchQuery)
            )
            setUserData(filteredUsers)
        }

        else {
            setUserData(userTotalData);
        }
    }, [searchQuery])

    const deleteMultipleUser = () => {

        if (sortedIds.length === 0) {
            context?.alertBox("error", "Please select items to delete.");
            return
        }

        try {
            deleteMultipleData(`/api/user/deleteMultiple`, {
                data: { ids: sortedIds },
            }).then((res) => {
                getUsers();
                setSortedIds([]);
                context.alertBox("success", "User Deleted");

            })
        } catch (error) {
            context.alertBox("error", "Error deleting item")
        }
    }

    const handleSelectAll = (e) => {
        const isChecked = e.target.checked;

        const updatedItems = userData.map((item) => ({
            ...item,
            checked: isChecked,
        }));
        setUserData(updatedItems);

        if (isChecked) {
            const ids = updatedItems.map((item) => item._id).sort((a, b) => a - b)
            setSortedIds(ids);
        } else {
            setSortedIds([]);
        }
    }

    const handleCheckboxChange = (e, id, index) => {
        const updatedItems = userData.map((item) =>
            item._id === id ? { ...item, checked: !item.checked } : item
        );
        setUserData(updatedItems);

        const selectedIds = updatedItems
            .filter((item) => item.checked)
            .map((item) => item._id)
            .sort((a, b) => a - b);
        setSortedIds(selectedIds);
    };

    const getUsers = async () => {
        setIsLoading(true);
        fetchDataFromApi("/api/user/getAllUsers")
            .then((res) => {
                let userArr = [];
                if (res?.error === false) {
                    for (let i = 0; i < res?.users?.length; i++) {
                        userArr[i] = res?.users[i];
                        userArr[i].checked = false;
                    }
                    setUserData(userArr);
                    setUserTotalData(userArr);
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    return (
        <>
            <div className='card my-4 !pt-5 !shadow=md sm:rounded-lg !bg-white' >

                <div className='flex items-center w-full !px-5 justify-between'>
                    <div className='col !w-[40%] '>
                        <h1 className='text-[18px] font-[600]'>User List</h1>
                    </div>

                    <div className='w-[40%] !mb-2 !ml-auto flex items-center gap-2'>
                        {
                            sortedIds?.length !== 0 &&
                            <Button
                                variant="contained"
                                className="btn-sm"
                                size='small' color='error'
                                onClick={deleteMultipleUser}>
                                Delete
                            </Button>
                        }
                        <SearchBox
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                        />

                    </div>
                </div>


                <TableContainer sx={{ maxHeight: 460 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead >

                            <TableRow>
                                <TableCell >
                                    <Checkbox size='small'
                                        onChange={handleSelectAll}
                                        checked={userData?.length > 0 ? userData.every((item) => item.checked) : false}
                                    />
                                </TableCell>

                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                isLoading === false ? userData?.length !== 0 && userData?.slice(
                                    page * rowsPerPage,
                                    page * rowsPerPage + rowsPerPage
                                )?.reverse()?.map((user, index) => {
                                    return (
                                        <TableRow key={index}>
                                            <TableCell style={{ minWidth: columns.minWidth }}>
                                                <Checkbox size='small'
                                                    checked={user.checked === true ? true : false}
                                                    onChange={(e) => handleCheckboxChange(e, user._id, index)}
                                                />
                                            </TableCell>

                                            <TableCell style={{ minWidth: columns.minWidth }}>
                                                <div className='flex items-center gap-4 w-[70px]'>
                                                    <div className='img !w-[45px] !h-[45px] !rounded-md !overflow-hidden group'>
                                                        <Link to="/">
                                                            <img src={user?.avatar !== null && user?.avatar !== undefined && user?.avatar !== "" ? user?.avatar : '/user.png'}
                                                                className='w-full group-hover:scale-105 transition-all' />
                                                        </Link>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell style={{ minWidth: columns.minWidth }}>
                                                {user?.name}
                                            </TableCell>

                                            <TableCell style={{ minWidth: columns.minWidth }}>
                                                <span className='flex items-center gap-2 '>
                                                    <MdOutlineMail />{user?.email}
                                                </span>
                                            </TableCell>

                                            <TableCell style={{ minWidth: columns.minWidth }}>
                                                <span className='flex items-center gap-2 '>
                                                    <FaPhone />{user?.mobile || "NONE"}
                                                </span>
                                            </TableCell>

                                            <TableCell style={{ minWidth: columns.minWidth }}>
                                                <span className='flex items-center gap-2 justify-center'>
                                                    {user?.verify_email === true ? <Badge status="confirm" /> : <Badge status="pending" />}
                                                </span>
                                            </TableCell>

                                            <TableCell style={{ minWidth: columns.minWidth }}>
                                                <span className='flex items-center gap-2 '>
                                                    <CiCalendar />{user?.createdAt.split('T')[0]}
                                                </span>
                                            </TableCell>

                                        </TableRow>
                                    )

                                })
                                    :
                                    <TableRow>
                                        <TableCell colSpan={10}>
                                            <div className='flex items-center justify-center w-full !min-h-[400px]'>
                                                <CircularProgress color="inherit" />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                            }



                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={userData?.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />

            </div>
        </>
    )
}

export default Users