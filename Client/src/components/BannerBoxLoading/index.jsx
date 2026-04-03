import React from 'react'

const BannerBoxLoading = () => {
    return (
        <div className="w-full flex-1">
            <div className="flex items-center justify-center w-full h-[180px] lg:h-[220px] bg-gray-200 animate-pulse rounded-[20px]">
                <svg className="w-10 h-10 text-gray-400" aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m3 16 5-7 6 6.5m6.5 2.5L16 13l-4.286 6M14 10h.01M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z" />
                </svg>
            </div>
        </div>
    )
}

export default BannerBoxLoading
