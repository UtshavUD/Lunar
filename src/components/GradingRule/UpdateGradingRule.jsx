import React, { useState, useEffect } from "react"; 
import { showToast } from "../../utils/ReactToast";
import CLoader from "../../utils/CLoader";

function UpdateGradingRule({ handleEditModal, data, updateHandle, setOriginalData }) {
    const [formData, setFormData] = useState(data || {});
    const [isBeingProcessed, setIsBeingProcessed] = useState(false);

    useEffect(() => {
        setFormData(data); // Update local state when `data` changes
    }, [data]);

    const formFields = [
        { name: "RuleName", label: "Rule Name:", type: "text", required: true }
    ];

    const gradingFields = [
        { name: "GradingName", label: "Grading Name:", type: "text", required: true },
        { name: "GradingRemarks", label: "Remarks:", type: "text", required: true }
    ];

    const handleChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }));
    };

    const handleGradingChange = (index, e) => {
        const updatedRuleItems = [...formData.RuleItems];
        updatedRuleItems[index] = { ...updatedRuleItems[index], [e.target.name]: e.target.value };
        setFormData((prevData) => ({
            ...prevData,
            RuleItems: updatedRuleItems
        }));
    };

    const submitUpdate = async (e) => {
        e.preventDefault();
    
        // ✅ Validate required fields
        if (!formData.RuleName?.trim()) {
            showToast("Rule Name is required!", "error");
            return;
        }
        
        if (formData.RuleItems.some(item => !item.GradingName?.trim() || !item.GradingRemarks?.trim())) {
            showToast("Grading Name and Remarks are required!", "error");
            return;
        }
    
        setIsBeingProcessed(true);
        
        // ✅ Call updateHandle & ensure it returns success status
        const success = await updateHandle(formData);
        if (success) {
            showToast("Update Successful", "success");
            handleEditModal();
            
            // ✅ Update Parent State Immediately
            setOriginalData((prevData) =>
                prevData.map((item) => (item.RuleId === formData.RuleId ? formData : item))
            );
        }
    };

    return (
        <div className="fixed inset-0 z-20 bg-black bg-opacity-75 flex justify-center items-center">
            <div className="flex mx-auto w-full justify-center mt-[64px] max-h-[100%]">
                <div className="w-full border sm:max-w-xl bg-white m-4 p-4 sm:m-10 overflow-y-auto">
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
                            Update Grade Items
                        </h1>
                        <form className="flex flex-col gap-6" onSubmit={submitUpdate}>
                            {formFields.map((field) => (
                                <div key={field.name}>
                                    <label htmlFor={field.name} className="block text-lg font-medium text-gray-800 mb-1">
                                        {field.label}
                                        {field.required && <span className="text-red-600"> *</span>}
                                    </label>
                                    <input
                                        id={field.name}
                                        type={field.type}
                                        name={field.name}
                                        value={formData[field.name] || ""}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-100"
                                        required
                                    />
                                </div>
                            ))}

                            {/* Grading Items */}
                            <h2 className="text-xl font-semibold text-gray-800 mt-4">Grading Details</h2>
                            {formData.RuleItems?.map((item, index) => (
                                <div key={index} className="p-2 border rounded-md">
                                    {gradingFields.map((field) => (
                                        <div key={field.name}>
                                            <label className="block text-lg font-medium text-gray-800 mb-1">
                                                {field.label}
                                                {field.required && <span className="text-red-600"> *</span>}
                                            </label>
                                            <input
                                                type={field.type}
                                                name={field.name}
                                                value={item[field.name] || ""}
                                                onChange={(e) => handleGradingChange(index, e)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-100"
                                                required
                                            />
                                        </div>
                                    ))}
                                </div>
                            ))}

                            <div className="flex justify-between gap-4 mt-4">
                                {/* ✅ Update Button */}
                                <div>
                                    {isBeingProcessed ? (
                                        <CLoader />
                                    ) : (
                                        <button
                                            type="submit"
                                            className="flex items-center gap-2 px-6 py-3 bg-blue-900 text-white text-md rounded-lg shadow-lg hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
                                        >
                                            <i className="bx bx-upload text-lg"></i>
                                            Update
                                        </button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UpdateGradingRule;
