import React, { useState, useEffect } from "react";
import { showToast } from "../../utils/ReactToast";
import CLoader from "../../utils/CLoader";

function UpdateGradelist({ handleEditModal, data, updateHandle }) {
    const [formData, setFormData] = useState(data || {});
    const [isBeingProcessed, setIsBeingProcessed] = useState(false);

    useEffect(() => {
        setFormData(data);
    }, [data]);

    const formFields = [
        { name: "GradeName", label: "Grade Name:", type: "text", colSpan: 1, required: true },
        { name: "AreaName", label: "Area Name", type: "text", colSpan: 1, required: true },
        { name: "LevelName", label: "Level Name", type: "text", colSpan: 1, required: true },
        { name: "TheoryPassPercent", label: "Theory Pass Percent", colSpan: 1, required: true },
        { name: "PracticalPassPercent", label: "Practical Pass Percent", colSpan: 1, required: true },
        { name: "GradeSheetCaption", label: "Grade-Sheet Caption", type: "text", colSpan: 1, required: true },
        { name: "MarkSheetCaption", label: "Mark-Sheet Caption", type: "text", colSpan: 1, required: true },
        { name: "AdmissionOpen", label: "Admission Open:",type:"checkbox", colSpan: 1, required: false },
        { name: "ParentAsBillPayer", label: "Parent As Bill Payer:",colSpan: 1, type: "checkbox", required: false }
    ];

    const handleChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const submitUpdate = async (e) => {
        e.preventDefault();
console.log(formData);
        // Check required fields
        const missingField = formFields.find((field) => field.required && !formData[field.name]);
        
        if (missingField) {
            showToast(`"${missingField.label}" is required!`, "error");
            return;
        }

        setIsBeingProcessed(true);
        await updateHandle(formData);
        setIsBeingProcessed(false);
    };

    return (
        <div className="fixed inset-0 z-20 bg-black bg-opacity-75 flex justify-center items-center">
            <div className="flex mx-auto w-full justify-center mt-[54px] max-h-[100%]">
                <div className="w-full border sm:max-w-xl bg-white m-4 p-4 sm:m-10 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-transparent">
                    <div className="flex justify-end">
                        <button
                            className="close-btn text-2xl text-indigo-700 font-extrabold hover:text-red-300"
                            onClick={handleEditModal}
                        >
                            X
                        </button>
                    </div>
                    <div className="mt-4">
                        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
                            Update GradeList
                        </h1>
                        <form className="flex flex-col gap-6">
                            {formFields.map((field) => (
                                <div key={field.name} className={`flex ${field.type === "checkbox" ? "gap-3" : "flex-col"}`}>
                                    <label htmlFor={field.name} className="text-md text-nowrap mr-2 font-medium text-gray-800 mb-1">
                                        {field.label}
                                        {field.required && <span className="text-red-600"> *</span>}
                                    </label>

                                    {field.type === "checkbox" ?
                                        (<input
                                        
                                            id={field.name}
                                            type="checkbox"
                                            name={field.name}                                            
                                            checked={formData[field.name]} // Boolean value
                                            onChange={(e) => setFormData({ ...formData, [field.name]: e.target.checked })}
                                            className="w-5 h-7"
                                        />
                                        ) : (
                                            <input
                                                id={field.name}
                                                type={field.type}
                                                name={field.name}
                                                value={formData[field.name] || ""}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-400"
                                                required
                                            />)}
                                </div>
                            ))}




                            <div className="md:col-span-2 flex flex-wrap justify-end gap-4">
                                {isBeingProcessed ? (
                                    <CLoader />
                                ) : (
                                    <button
                                        type="submit"
                                        onClick={submitUpdate}
                                        className="flex items-center gap-2 px-6 py-3 bg-blue-900 text-white text-md rounded-lg shadow-lg hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
                                    ><i class='bx bx-upload text-lg'></i>
                                        Update
                                    </button>
                                )}
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UpdateGradelist;
