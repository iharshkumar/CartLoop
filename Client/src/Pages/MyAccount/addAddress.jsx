import { useState } from 'react'
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import CircularProgress from '@mui/material/CircularProgress';
import React, { useContext, useEffect } from 'react'
import AccountSidebar from '../../components/AccountSidebar'
import { MyContext } from '../../App';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import Button from '@mui/material/Button';
import { editData, fetchDataFromApi, postData } from '../../utils/api';

const AddAddress = (props) => {

    const context = useContext(MyContext)
    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false)
    const [addressType, setAddressType] = useState("");
    const [isEdit, setIsEdit] = useState("add")

    const [formFields, setFormFields] = useState({
        fullName: '',
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

    useEffect(() => {
        if (context?.userData?._id !== "" && context?.userData?._id !== undefined) {
            setFormFields((prevState) => ({
                ...prevState,
                userId: context.userData?._id
            }))
        }
    }, [context?.userData])

    useEffect(() => {
        if (context?.editId !== null && context?.editId !== undefined) {
            setIsEdit("edit");
            fetchDataFromApi(`/api/address/${context.editId}`).then((res) => {
                if (res?.success) {
                    setFormFields({
                        _id: res.address._id,
                        fullName: res.address.fullName,
                        address_line1: res.address.address_line1,
                        city: res.address.city,
                        state: res.address.state,
                        pincode: res.address.pincode,
                        country: res.address.country,
                        mobile: res.address.mobile,
                        userId: res.address.userId,
                        landmark: res.address.landmark,
                        addressType: res.address.addressType
                    })
                    setAddressType(res.address.addressType);
                    setPhone(res.address.mobile ? res.address.mobile.toString() : "");
                }
            })
        } else {
            setIsEdit("add");
            resetForm();
        }
    }, [context?.editId])

    const onChangeInput = (e) => {
        const { name, value } = e.target
        setFormFields(() => {
            return {
                ...formFields,
                [name]: value
            }
        })
    }


    const handleChangeAddressType = (event) => {
        setAddressType(event.target.value);
        setFormFields((formFields) => ({
            ...formFields,
            addressType: event.target.value
        }))
    }


    const resetForm = () => {
        context.setEditId(null);
        setFormFields({
            fullName: '',
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


    const handleSubmit = (e) => {

        e.preventDefault()

        setIsLoading(true)
        if (formFields.fullName === "") {
            context.alertBox("error", "Please enter Full Name")
            setIsLoading(false);
            return false
        }
        if (formFields.address_line1 === "") {
            context.alertBox("error", "Please enter Full Address")
            return false
        }

        if (formFields.city === "") {
            context.alertBox("error", "Please enter your City")
            return false
        }

        if (formFields.state === "") {
            context.alertBox("error", "Please enter State")
            return false
        }

        if (formFields.pincode === "") {
            context.alertBox("error", "Please enter Pincode")
            return false
        }

        if (formFields.country === "") {
            context.alertBox("error", "Please enter Country")
            return false
        }

        if (phone === "") {
            context.alertBox("error", "Please enter your 10-digit Mobile Number")
            return false
        }

        if (formFields.addressType === "") {
            context.alertBox("error", "Please select Address Type")
            return false
        }

        if (formFields.landmark === "") {
            context.alertBox("error", "Please enter Landmark")
            return false
        }



        if (isEdit === "add") {
            postData(`/api/address/add`, formFields).then((res) => {
                if (res?.error !== true) {
                    setIsLoading(false)
                    context.alertBox("success", res?.message)
                    context.setOpenAddressPanel(false)
                    resetForm();
                    context.getAddresses();
                } else {
                    context.alertBox("error", res?.message)
                    setIsLoading(false)
                }
            })
        } else {
            editData(`/api/address/update`, formFields).then((res) => {
                if (res?.error !== true) {
                    setIsLoading(false)
                    context.alertBox("success", res?.message)
                    context.setOpenAddressPanel(false)
                    resetForm();
                    context.getAddresses();
                } else {
                    context.alertBox("error", res?.message)
                    setIsLoading(false)
                }
            })
        }
    }

    const editAddress = (id) => {
        setIsEdit("edit");
        context.setOpenAddressPanel(true);

        fetchDataFromApi(`/api/address/${id}`).then((res) => {
            if (res?.success) {
                setFormFields({
                    _id: res.address._id,
                    fullName: res.address.fullName,
                    address_line1: res.address.address_line1,
                    city: res.address.city,
                    state: res.address.state,
                    pincode: res.address.pincode,
                    country: res.address.country,
                    mobile: res.address.mobile,
                    userId: res.address.userId,
                    landmark: res.address.landmark,
                    addressType: res.address.addressType
                })
                setAddressType(res.address.addressType);
                setPhone(res.address.mobile ? res.address.mobile.toString() : "");
            }
        })
    }

    return (
        <form className='!p-8 !py-3' onSubmit={handleSubmit}>
            <div className='flex items-center gap-5 !pb-5'>
                <div className='col w-[100%]'>
                    <TextField
                        className='w-full'
                        label="Full Name"
                        variant="outlined"
                        size='small'
                        name="fullName"
                        onChange={onChangeInput}
                        value={formFields.fullName}
                    />
                </div>
            </div>

            <div className='flex items-center gap-5 !pb-5'>
                <div className='col w-[100%]'>
                    <TextField
                        className='w-full'
                        label="Address_line1"
                        variant="outlined"
                        size='small'
                        name="address_line1"
                        onChange={onChangeInput}
                        value={formFields.address_line1}
                    />
                </div>
            </div>

            <div className='flex flex-col sm:flex-row items-center gap-5 !pb-5'>
                <div className='col w-full sm:w-[50%]'>
                    <TextField
                        className='w-full'
                        label="City"
                        variant="outlined"
                        size='small'
                        name="city"
                        onChange={onChangeInput}
                        value={formFields.city}
                    />
                </div>

                <div className='col w-full sm:w-[50%]'>
                    <TextField
                        className='w-full'
                        label="State"
                        variant="outlined"
                        size='small'
                        name="state"
                        onChange={onChangeInput}
                        value={formFields.state}
                    />
                </div>
            </div>

            <div className='flex flex-col sm:flex-row items-center gap-5 !pb-5'>
                <div className='col w-full sm:w-[50%]'>
                    <TextField
                        className='w-full'
                        label="Pincode"
                        variant="outlined"
                        size='small'
                        name="pincode"
                        onChange={onChangeInput}
                        value={formFields.pincode}
                    />
                </div>

                <div className='col w-full sm:w-[50%]'>
                    <TextField
                        className='w-full'
                        label="Country"
                        variant="outlined"
                        size='small'
                        name="country"
                        onChange={onChangeInput}
                        value={formFields.country}
                    />
                </div>
            </div>


            <div className='w-[100%]'>
                <PhoneInput
                    defaultCountry="in"
                    value={phone}
                    disabled={isLoading === true ? true : false}
                    onChange={(phone) => {
                        setPhone(phone);
                        setFormFields((prevState) => ({
                            ...prevState,
                            mobile: phone
                        }))
                    }}
                />
            </div>

            <div className='w-[100%] !py-5'>
                <TextField
                    className='w-full'
                    label="Landmark"
                    variant="outlined"
                    size='small'
                    name="landmark"
                    onChange={onChangeInput}
                    value={formFields.landmark}
                />
            </div>


            <div className='flex flex-col gap-5 !pb-5'>
                <FormControl>
                    <FormLabel id="demo-radio-buttons-group-label">Address Type</FormLabel>
                    <RadioGroup
                        row aria-labelledby="demo-radio-buttons-group-label"
                        name="addressType"
                        onChange={handleChangeAddressType}
                        value={addressType}
                    >
                        <FormControlLabel value="home" control={<Radio />} label="Home" />
                        <FormControlLabel value="work" control={<Radio />} label="Work" />
                    </RadioGroup>
                </FormControl>
            </div>


            {
                isLoading === true ? (
                    <div className='!mt-1 btn-org btn-lg w-full items-center justify-center flex gap-2'><CircularProgress color='inherit' /></div>
                ) : (
                    <Button type="submit" className='!mt-1 btn-org btn-lg w-full flex gap-2'>
                        Save
                    </Button>
                )
            }

            <div className='!mt-3'>
                <Button className='!mt-1 btn-org btn-border btn-lg w-[100%] flex gap-2'
                    onClick={() => context.setOpenAddressPanel(false)} >
                    Cancel
                </Button>
            </div>

        </form>
    )
}

export default AddAddress