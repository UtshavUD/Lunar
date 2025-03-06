import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import customAxios from '../../utils/http';
import { showToast } from '../../utils/ReactToast';
import handleCatchError from '../../utils/handleCatchError';
import CLoader from '../../utils/CLoader';

function InsertGradelist({ setOriginalData, setInsertModalOpen }) {
  const navigate = useNavigate();
  const [isBeingProcessed, setIsBeingProcessed] = useState(false);
  const [formData, setFormData] = useState({});
 
  const formFields = [
    { name: "GradeName", label: "Grade Name:", type: "text", colSpan: 1, required: true },
    { name: "AreaName", label: "Area Name" ,colSpan: 1, required: true },
    { name: "LevelName", label:"Level Name" , colSpan: 1, required: true },
    { name: "TheoryPassPercent", label:"Theory Pass Percent" , colSpan: 1, required: true },
    { name: "PracticalPassPercent", label:"Practical Pass Percent" , colSpan: 1, required: true },
    { name: "GradeSheetCaption", label:"Grade-Sheet Caption" , colSpan: 1, required: true },
    { name: "MarkSheetCaption", label:"Mark-Sheet Caption" , colSpan: 1, required: true }
  ];

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "date" ? new Date(value).toISOString().split("T")[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = formFields.filter(field => field.required);
    const missingField = requiredFields.find(field => !formData[field.name]?.trim());

    if (missingField) {
      showToast(`"${missingField.label}" is required!`, 'error');
      return;
    }

    try {
      setIsBeingProcessed(true);

      const payload = {
        AreaName: formData.AreaName,
        GradeName: formData.GradeName,
        LevelName: formData.LevelName,
        TheoryPassPercent: formData.TheoryPassPercent,
        PracticalPassPercent: formData.PracticalPassPercent,
        GradeSheetCaption: formData.GradeSheetCaption,
        MarkSheetCaption: formData.MarkSheetCaption
      };

      console.log("Sending payload:", payload);

      const response = await customAxios.post('/GradeList/Insert', payload);
      if (response.status === 200) {
        const newData = response.data;
        setOriginalData((prev) => [...prev, newData]);
        setInsertModalOpen(false);
        showToast("Grade Inserted Successfully", "success");
      }
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      handleCatchError(error, navigate);
    } finally {
      setIsBeingProcessed(false);
    }
  };

  return (
    <div className='absolute top-14 h-fit inset-0 z-20 bg-black bg-opacity-75 flex justify-center items-center '>
      <div className='w-full border bg-white sm:max-w-xl p-6 m-4 overflow-y-auto'>
        <div className='flex justify-end'>
          <button className="text-2xl font-extrabold text-indigo-700 hover:text-red-300" onClick={() => setInsertModalOpen(false)}>X</button>
        </div>
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Insert Gradelist Detail</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {formFields.map((field) => (
            <div key={field.name} className={`md:col-span-${field.colSpan}`}>
              <label htmlFor={field.name} className="block text-lg font-medium text-gray-800 mb-1">
                {field.label} {field.required && <span className="text-red-600">*</span>}
              </label>
              <input
                id={field.name}
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name] || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                required={field.required}
              />
            </div>
          ))}
          
          <div className="flex justify-end gap-4">
            <button type="button" onClick={() => setFormData({})} className="px-6 py-3 bg-red-700 text-white rounded-lg">Clear</button>
            {isBeingProcessed ? <CLoader /> : <button type="submit" className="px-6 py-3 bg-blue-900 text-white rounded-lg">Insert</button>}
          </div>
        </form>
      </div>
    </div>
  );
}

export default InsertGradelist;
