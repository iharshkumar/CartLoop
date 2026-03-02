import { Button, Checkbox, CircularProgress } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { FaCloudUploadAlt } from 'react-icons/fa'
import { GoTrash } from 'react-icons/go'
import { MdOutlineModeEdit } from 'react-icons/md'
import { MyContext } from '../../App'
import { deleteData, editData, fetchDataFromApi, postData } from '../../utils/api'

const AddRAMS = () => {
    const [isLoading, setIsLoading] = useState(false)

    const [name, setName] = useState()
    const [data, setData] = useState([])
    const context = useContext(MyContext)
    const [editId, seteditId] = useState('')
    // const [formFields, setFormFields] = useState({
    //     name: '',
    // })
    const getData = () => {
        fetchDataFromApi("/api/product/productRAMS/get").then((res) => {
            console.log(res)
            if (res?.error === false) {
                setData(res?.data)
            }
        })
    }

    useEffect(() => {
        getData();
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();

        setIsLoading(true)
        if (name === "") {
            context.alertBox("error", "Please enter Product RAM");
            return false
        }

        if (editId === "") {
            postData("/api/product/productRAMS/create", {
                name: name
            })
                .then((res) => {
                    if (res?.error === false) {
                        context.alertBox("success", res?.message);
                        setTimeout(() => {
                            setIsLoading(false);
                            getData();
                            setName("");
                        }, 500);
                    } else {
                        context.alertBox("error", res?.message);
                        setIsLoading(false);
                    }
                })
                .catch(() => {
                    context.alertBox("error", "Something went wrong");
                    setIsLoading(false);
                });
        }
        if (editId !== "") {
            editData(`/api/product/productRAMS/${editId}`, {
                name: name
            }).then((res) => {
                if (res?.data?.error === false) {
                    context.alertBox("success", res?.data?.message);
                    setTimeout(() => {
                        setIsLoading(false);
                        getData();
                        setName("");
                    }, 500);

                } else {
                    context.alertBox("error", res?.data?.message);
                }

            })
        }
    }

    const deleteItem = (id) => {
        deleteData(`/api/product/productRAMS/${id}`).then(() => {
            getData();
            context?.alertBox("success", "Item deleted")
        })
    }

    const editItem = (id) => {
        fetchDataFromApi(`/api/product/productRAMS/${id}`).then((res) => {
            setName(res?.data?.name);
            seteditId(res?.data?._id);

        })
    }

    return (
        <>
            <div className='flex items-center justify-between !px-2 !py-0 !mt-3 bg-white-[65%]'>
                <h1 className='text-[20px] font-[600]'>Add Product RAMS</h1>
            </div>

            <div className='card my-4 pt-5 pb-5 !shadow=md sm:rounded-lg !bg-white w-[65%]' >
                <form className='form !py-3 !p-8' onSubmit={handleSubmit}>
                    <div className='col mb-4'>
                        <h3 className='text-[14px] font-[500] !mb-1'>PRODUCT RAM</h3>
                        <input
                            type="text"
                            className='w-full h-[40px] border border-[rgba(0,0,0,0.2) !focus:outline-none !focus:border-[rgba(0,0,0,0.4)] !rounded-sm !p-3 !text-sm !bg-[#fafafa]'
                            name="name"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                        />
                    </div>
                    <Button type='submit' className='btn-blue btn-lg w-full flex gap-4'>
                        {
                            isLoading === true ? <CircularProgress color="inherit" />
                                :
                                <>
                                    <FaCloudUploadAlt className='text-[25px] text-white' />
                                    Publish and View
                                </>
                        }

                    </Button>
                </form>
            </div>


            {
                data?.length !== 0 &&
                <div className='card my-4 pt-5 pb-5 !shadow=md sm:rounded-lg !bg-white w-[65%]' >
                    <div className="relative overflow-x-auto !pb-5">
                        <table className="w-full text-sm text-left rtl:text-right text-body border-collapse">
                            <thead className="text-sm text-body bg-[#f1f1f1] !border-b !border-[rgba(0,0,0,0.1)]">
                                <tr>
                                    <th scope="col" className="!px-6 !pr-0 !py-3 font-medium" width="10%">
                                        <div className='w-[60px]'>
                                            <Checkbox size='small' />
                                        </div>
                                    </th>
                                    <th scope="col" className="!px-2 !py-3 font-medium whitespace-nowrap" width="60%">
                                        PRODUCT RAM
                                    </th>
                                    <th scope="col" className="!px-6 !py-3 font-medium whitespace-nowrap" width="30%">
                                        ACTION
                                    </th>

                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data?.map((item, index) => {
                                        return (
                                            <tr className='!odd:bg-white !odd:dark:bg-gray-900 !even:bg-gray-50 !even:dark:bg-gray-800 border-b dark:border-gray-700' key={index}>
                                                <td className='!px-6 !pr-0 !py-3'>
                                                    <div className='w-[60px]'>
                                                        <Checkbox size='small' />
                                                    </div>
                                                </td>


                                                <td className='!px-6 !py-3'>
                                                   <span className='font-[600]'>{item?.name}</span>
                                                </td>


                                                <td className='!px-6 !py-3'>
                                                    <div className='flex items-center gap-1'>
                                                        <Button className='!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]'
                                                            onClick={() => editItem(item?._id)}>
                                                            <MdOutlineModeEdit className='text-[rgba(0,0,0,0.7)] text-[20px] ' />
                                                        </Button>
                                                        <Button className='!w-[35px] !h-[35px] !min-w-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1]'
                                                            onClick={() => deleteItem(item?._id)}>
                                                            <GoTrash className='text-[rgba(0,0,0,0.7)] text-[20px] ' />
                                                        </Button>
                                                    </div>
                                                </td>

                                            </tr>
                                        )
                                    })
                                }



                            </tbody>

                        </table>
                    </div>
                </div>
            }


        </>
    )
}

export default AddRAMS