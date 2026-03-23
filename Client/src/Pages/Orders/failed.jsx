import React from 'react'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'
import "../../index.css"

const OrderFailed = () => {
    return (
        <section className='w-full !p-10 !py-20 flex items-center justify-center flex-col gap-2'>
            <img src="/cross.png" width={100} height={100} />
            <h1 className='!mb-0 text-[25px]'>Your Order is failed</h1>
            <p className='!mt-0'>Sorry for the inconvenience</p>
            <Link to="/">
                <Button className='btn-org !border-none'>Back to Home</Button>
            </Link>
        </section>
    )
}

export default OrderFailed