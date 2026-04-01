import React from 'react'

const ProductLoading = (props) => {

    if (props?.view === 'list') {
        const dummyArray = Array.from({ length: 5 });
        return (
            <div className="w-full flex flex-col gap-4 col-span-1 md:col-span-5">
                {dummyArray.map((_, index) => (
                    <div key={index} className='bg-white border border-gray-200 rounded-lg p-3 md:p-4 flex flex-row gap-3 md:gap-4 animate-pulse h-auto min-h-[160px] md:h-[250px] overflow-hidden'>
                        <div className="bg-gray-200 !rounded-lg flex-shrink-0 w-[35%] min-w-[120px] md:w-[200px]" style={{ aspectRatio: '3/4' }}></div>
                        <div className='flex-1 flex flex-col justify-between py-1 md:py-2'>
                            <div>
                                <div className="h-2 bg-gray-200 rounded-full w-20 md:w-32 mb-2 md:mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded-full w-3/4 mb-2 md:mb-4"></div>
                                <div className="hidden sm:block h-3 bg-gray-200 rounded-full w-full mb-2"></div>
                                <div className="hidden md:block h-3 bg-gray-200 rounded-full w-full mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded-full w-20 md:w-24 mb-2"></div>
                            </div>
                            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between mt-auto gap-2'>
                                <div className="h-4 bg-gray-200 rounded-full w-16 md:w-24"></div>
                                <div className="h-8 md:h-10 bg-gray-200 rounded-full w-24 md:w-32"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (props?.view === 'grid') {
        const dummyArray = Array.from({ length: 10 });
        return (
            <>
                {dummyArray.map((_, index) => (
                    <div key={index} className='col w-full h-auto mb-8 animate-pulse'>
                        <div className="flex items-center justify-center mb-3 w-full h-[250px] bg-gray-200 rounded-md">
                            <svg className="w-11 h-11 text-gray-400" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m3 16 5-7 6 6.5m6.5 2.5L16 13l-4.286 6M14 10h.01M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z" />
                            </svg>
                        </div>
                        <div className="!h-2.5 !bg-gray-200 !rounded-full !w-[80%] !mb-4"></div>
                        <div className="!h-2 !bg-gray-200 !rounded-full !w-[90%] !mb-2"></div>
                        <div className="!h-2 !bg-gray-200 !rounded-full !w-[70%] !mb-2"></div>
                        <div className="!h-2 !bg-gray-200 !rounded-full !w-[60%] !mb-2"></div>
                    </div>
                ))}
            </>
        )
    }

    const dummyArray = Array.from({ length: 7 });
    return (
        <div className='flex items-center gap-3 animate-pulse w-[700px] lg:w-full'>
            {dummyArray.map((_, index) => (
                <div key={index} className='col w-[16%] h-[250px] !mb-8'>
                    <div className="flex items-center justify-center !mb-3 w-full h-48 bg-gray-200 rounded-md ">
                        <svg className="w-11 h-11 text-gray-400" aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m3 16 5-7 6 6.5m6.5 2.5L16 13l-4.286 6M14 10h.01M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z" />
                        </svg>
                    </div>
                    <div className="!h-2.5 !bg-gray-200 !rounded-full w-24 lg:!w-48 !mb-4"></div>
                    <div className="!h-2 !bg-gray-200 !rounded-full w-28 lg:!w-56 !mb-2"></div>
                    <div className="!h-2 !bg-gray-200 !rounded-full w-24 lg:!w-48 !mb-2"></div>
                    <div className="!h-2 !bg-gray-200 !rounded-full w-20 lg:!w-36 !mb-2"></div>
                </div>
            ))}
        </div>
    )
}

export default ProductLoading