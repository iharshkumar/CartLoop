import React from 'react'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'
import "../../index.css"

const OrderSuccess = () => {
    return (
        <section className='w-full !p-10 !py-20 flex items-center justify-center flex-col gap-2'>
            <img src="/check.png" width={100} height={100} />
            <h1 className='!mb-0 text-[25px]'>Your Order is placed</h1>
            <p className='!mt-0'>Thank you for your payment</p>
            <Link to="/">
                <Button className='btn-org !border-none'>Back to Home</Button>
            </Link>
        </section>
    )
}

export default OrderSuccess