import React, { useState } from 'react'
import Button from '@mui/material/Button'
import { FaAngleUp } from 'react-icons/fa'
import { FaAngleDown } from 'react-icons/fa'

const QtyBox = (props) => {
    const [qtyVal, setQtyVal] = useState(1);

    const plusQty = () => {
        const newQty = qtyVal + 1;
        setQtyVal(newQty)
        if (props.onChange) {
            props.onChange(newQty)
        }
    }

    const minusQty = () => {
        if (qtyVal > 1) {
            const newQty = qtyVal - 1;
            setQtyVal(newQty)
            if (props.onChange) {
                props.onChange(newQty)
            }
        }
    }

    return (
        <div className='qtyBox flex items-center relative'>

            <input type="number" className='w-full h-[40px] !p-2 text-[15px] 
            focus:ouline-none !border !border-[rgba(0,0,0,0.2)] !rounded-md' value={qtyVal} readOnly />

            <div className='flex items-center flex-col justify-between h-[40px] absolute top-0
             right-0 z-50 !border-l-0 !border-[#000] '>
                <Button className='!min-w-[25px] !w-[25px] !h-[20px] !text-[#000] rounded-none hover:!bg-[#f1f1f1]'
                    onClick={plusQty}>
                    <FaAngleUp className='text-[12px] opacity-55' /></Button>
                <Button className='!min-w-[25px] !w-[25px] !h-[20px] !text-[#000] rounded-none hover:!bg-[#f1f1f1]'
                    onClick={minusQty}>
                    <FaAngleDown className='text-[12px] opacity-55' /></Button>

            </div>



        </div>
    )
}

export default QtyBox