import React, { useContext, useState } from 'react'
import { Button, CircularProgress } from '@mui/material'
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { MdOutlineModeEdit } from 'react-icons/md';
import { MyContext } from '../../App';
import { editData, deleteData } from '../../utils/api';
import { FaRegTrashCan } from "react-icons/fa6";


const EditSubCatBox = (props) => {

  const [editMode, setEditMode] = useState(false);
  const context = useContext(MyContext);
  const [selectVal, setSelectVal] = useState(props?.selectedCat || '');
  const [isLoading, setIsLoading] = useState(false);

  const [formFields, setFormFields] = useState({
    name: props?.name || "",
    parentCatName: props?.selectedCatName ?? null,
    parentId: props?.selectedCat ?? null
  })

  const onChangeInput = (e) => {
    const { name, value } = e.target;

    const catId = selectVal;
    setSelectVal(catId);

    setFormFields(() => {
      return {
        ...formFields,
        [name]: value
      }
    })
  }

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectVal(value);
    setFormFields(prev => ({
      ...prev,
      parentId: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (formFields.name === "") {
      context.alertBox("error", "Please enter Category name");
      return false
    }

    editData(`/api/category/${props?.id}`, formFields).then(() => {
      setTimeout(() => {
        context.alertBox("success", "Category updated successfully");
        context?.getCat();
        setIsLoading(false);
        setEditMode(false);
      }, 1000);
    })
  }


  const deleteSubCat = (id) => {
    if (window.confirm("Are you sure you want to delete this Category?")) {
      deleteData(`/api/category/${id}`).then(() => {
        context.alertBox("success", "Category deleted successfully");
        context?.getCat();
      })
    }
  }



  return (
    <form className='w-full flex items-center gap-3 !p-0 !px-4' onSubmit={handleSubmit}>
      {
        editMode === true &&
        <>
          <div className='w-full flex flex-col md:flex-row items-start md:items-center justify-between !py-3 md:!py-2 gap-3 md:gap-4'>
            <div className='w-full md:w-[150px]'>
              <Select
                className="w-full !text-sm"
                value={selectVal}
                size="small"
                onChange={handleChange}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
              >
                {
                  props?.catData?.length !== 0 && props?.catData?.map((item, index) => {
                    return (
                      <MenuItem
                        value={item?._id}
                        key={index}
                        onClick={() => {
                          setFormFields(prev => ({
                            ...prev,
                            parentCatName: item?.name
                          }))
                        }}
                      >
                        {item?.name}
                      </MenuItem>
                    )
                  })
                }
              </Select>
            </div>

            <input
              type='text'
              className='w-full md:flex-1 !h-[35px] !border !border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm !px-3 !text-sm'
              name="name"
              value={formFields?.name}
              onChange={onChangeInput} />

            <div className='flex flex-col md:flex-row items-center gap-2 w-full md:w-auto'>
              <Button size="small"
                className='btn-blue btn-sm w-full md:w-auto !min-w-fit !h-[35px]'
                type='submit'
                variant='contained'>
                {
                  isLoading === true ? <CircularProgress color="inherit" size={16} />
                    :
                    <>
                      Update
                    </>
                }
              </Button>
              <Button size="small"
                className='btn-sm w-full md:w-auto !min-w-fit !h-[35px]'
                variant="outlined"
                onClick={() => setEditMode(false)}>Cancel</Button>
            </div>
          </div>
        </>
      }

      {
        editMode === false &&
        <>
          <span className='font-[500] text-[14px]'>{props?.name}</span>
          <div className='flex items-center !ml-auto gap-2'>
            <Button className='!min-w-[35px] !w-[35px] !h-[35px] !rounded-full !text-[#2c2c2c] hover:!bg-[#e1e1e1]'
              onClick={() => {
                setEditMode(true);
                setSelectVal(props.selectedCat);
              }}><MdOutlineModeEdit />
            </Button>

            <Button className='!min-w-[35px] !w-[35px] !h-[35px] !rounded-full !text-[#d32f2f] hover:!bg-[#ffebee]'
              onClick={() => {
                deleteSubCat(props?.id);
              }}><FaRegTrashCan />
            </Button>
          </div>
        </>
      }

    </form>
  )
}

export default EditSubCatBox