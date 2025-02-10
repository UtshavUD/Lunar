import React from 'react'

function SeeAllOffice({ handleSeeAllModal, data, index }) {

    return (
        <>
            <div className='fixed inset-0 z-20 bg-black bg-opacity-80 flex justify-center items-center'>
                <div className='relative sm:max-w-[50%]  max-h-[90vh] flex justify-center items-center p-4 mt-[64px]'>
                    {/* Card container */}
                    <div className={`${data.IsCurrentSession ? 'bg-gradient-to-b from-green-200 via-green-300 to-green-500': 'bg-blue-200' } w-full border rounded-lg flex flex-col gap-4 shadow-md p-7 m-4 
                        overflow-y-auto max-h-[80vh] scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-transparent`}>
                        <button
                            className="absolute right-[12%] top-[8%] text-2xl text-violet-950 font-extrabold hover:text-red-500"
                            onClick={handleSeeAllModal}>
                            X
                        </button>
                        <h3 className="text-2xl font-semibold text-red-950 mt-2">
                            {(`${index + 1}.   ${data?.SessionName}`)}
                        </h3>
                        <div className='flex flex-col gap-1'>
                            <p className=" mt-2"><b>Session Name:</b> {data?.SessionName}</p>
                            <p className=" mt-2"><b>Start Date(B.S):</b> {data?.SessionStartDateBs}</p>
                            <p className=" mt-2"><b>End Date(B.S):</b> {data?.SessionEndDateBs}</p>
                            <p className=" mt-2"><b>Start Date(A.D):</b> {data?.SessionStartDate}</p>
                            <p className=" mt-2"><b>End Date(A.D):</b> {data?.SessionEndDate}</p>
                            <p className=" mt-2"><b>Current Session:</b> {data.IsCurrentSession ? "Yes": "No"}</p>
                            <p className=" mt-2"><b>Is Active? :</b> {data.IsActive ? "Yes" : "None"}</p>
                        </div>


                        {/* <p className="text-gray-600 mt-2"><b>Office Email:</b> {data?.OfficeEmail}</p>
                        <p className="text-gray-600 mt-2"><b>Phone Number:</b> {data?.OfficePhonePrimary}</p>
                        {/* For only viewAll */}
                        {/* <div>
                            <p className="text-gray-600 mt-2"><b>Secondary Phone Number:</b> {data?.OfficePhoneSecondary || "None"}</p>
                            <p className="text-gray-600 mt-2"><b>Moto:</b> {data?.Motto || "None"}</p>
                            <p className="text-gray-600 mt-2"><b>Website:</b> {data?.WebSite || "None"}</p>

                            <div className="text-gray-500 mt-8 text-sm">
                                <p className=" mt-2"><b>Developed By:</b> {data?.DevelopedBy || "None"}</p>
                                <p className=" mt-2"><b>Developer Site:</b> {data?.DeveloperSite || "None"}</p>
                            </div>
                        </div> */}


                        <div className="mt-4">
                            <span
                                className={`inline-block px-4 py-1 rounded-full text-white text-sm font-medium ${data.IsActive ? "bg-green-500" : "bg-red-500"
                                    }`}
                            >
                                {data.IsActive ? "Active" : "Blocked"}
                            </span>
                        </div>

                        {/* For back in details page
                        <div className="mt-6 flex justify-center gap-4">
                            <button
                                onClick={handleSeeAllModal}
                                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-500 transition duration-300">
                                Cancel
                            </button>
                        </div> */}

                    </div>
                </div>
            </div>
        </>
    )
}

export default SeeAllOffice
