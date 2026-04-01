import React, { useContext, useEffect } from 'react'
import AccountSidebar from '../../components/AccountSidebar'
import Radio from '@mui/material/Radio';
import { MyContext } from '../../App';
import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import { BsFillBagFill } from 'react-icons/bs';
import { deleteData, editData, fetchDataFromApi, postData } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { FaRegTrashAlt } from "react-icons/fa";
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import CircularProgress from '@mui/material/CircularProgress';
import AddressBox from './addressBox';

const label = { slotProps: { input: { 'aria-label': 'Radio demo' } } };

const Address = () => {

    const context = useContext(MyContext)
    const [phone, setPhone] = useState('');
    const [isOpenModel, setIsOpenModel] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const history = useNavigate();
    const [addressType, setAddressType] = useState("");
    const [isEdit, setIsEdit] = useState("add")

    const resetForm = () => {
        setFormFields({
            address_line1: '',
            city: '',
            state: '',
            pincode: '',
            country: '',
            mobile: '',
            userId: context.userData?._id,
            landmark: "",
            addressType: ""
        })
        setAddressType("");
        setPhone("");
    }

    const handleClose = () => {
        setIsOpenModel(false);
        resetForm();
    };

    const openAddAddress = () => {
        setIsEdit("add");
        resetForm();
        setIsOpenModel(true);
    }

    const [formFields, setFormFields] = useState({
        address_line1: '',
        city: '',
        state: '',
        pincode: '',
        country: '',
        mobile: '',
        userId: context.userData?._id,
        landmark: "",
        addressType: ""
    })

    const removeaddress = (id) => {
        deleteData(`/api/address/${id}`).then((res) => {
            context.getAddresses();
        })
    }

    const editAddress = (id) => {
        context.setEditId(id);
        context.setOpenAddressPanel(true);
    }


    return (
        <>
            <section className='!py-10 w-full'>
                <div className='container flex flex-col lg:flex-row gap-5 px-4 lg:px-0'>
                    <div className='col1 hidden lg:block w-[20%]'>
                        <AccountSidebar />
                    </div>


                    <div className='col2 w-full lg:w-[70%]'>
                        <div className='card bg-white !p-5 !shadow-md !rounded-md !mb-5'>
                            <div className='flex items-center !pb-3'>
                                <h2 className='!pb-0'>Address</h2>
                            </div>
                            <hr />



                            <div className='flex items-center justify-center !mt-4 !p-5 !border !border-dashed !border-[rgba(0,0,0,0.2)] !bg-[#f1faff] hover:bg-[#e7f3f9] cursor-pointer !rounded-md'
                                onClick={() => context?.toggleAddressPanel(true)}
                            >
                                <span className='text-[14px] font-[500]'>Add Address</span>

                            </div>

                            <div className='flex gap-2 flex-col !mt-4'>
                                {
                                    context.address?.length > 0 && context.address?.map((address, index) => {
                                        return (
                                            <AddressBox key={index} address={address} removeAddress={removeaddress} editAddress={editAddress} />
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>
    )
}

export default Address