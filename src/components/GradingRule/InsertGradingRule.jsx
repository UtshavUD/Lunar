import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import customAxios from '../../utils/http';
import { showToast } from '../../utils/ReactToast';
import handleCatchError from '../../utils/handleCatchError';
import CLoader from '../../utils/CLoader';

function InsertGradingRule({ setOriginalData, setInsertModalOpen }) {
  const navigate = useNavigate();
  const [isBeingProcessed, setIsBeingProcessed] = useState(false);
  const [formData, setFormData] = useState({ RuleId: 0 });

  const formFields = [
    { name: "RuleName", label: "Rule Name", type: "text", colSpan: 1, required: true },
    { name: "GradingName", label: "Grading Name", colSpan: 1, required: true },
    { name: "GradingRemarks", label: "Grading Remarks", colSpan: 1, required: true },
    { name: "GradingPoint", label: "Grading Point", type: "number", colSpan: 1, required: true },
    { name: "LowerLimit", label: "Lower Limit", type: "number", colSpan: 1, required: true }
  ];

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ["GradingPoint", "LowerLimit"].includes(name) ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const missingField = formFields.find(field => field.required && !formData[field.name]?.toString().trim());

    if (missingField) {
      showToast(`"${missingField.label}" is required!`, 'error');
      return;
    }

    try {
      setIsBeingProcessed(true);
      const payload1 = { RuleName: formData.RuleName, RuleId: formData.RuleId };
      const response1 = await customAxios.post('/GradingRule/Insert', payload1);
      
      if (response1.status === 200) {
        const ruleId = response1?.data?.RuleId;
        showToast("Rule Inserted Successfully", "success");
        
        if (!ruleId) {
          showToast("Failed to retrieve Rule ID!", "error");
          return;
        }

        const payload2 = {
          LowerLimit: Number(formData.LowerLimit),
          GradingName: formData.GradingName,
          GradingRemarks: formData.GradingRemarks,
          GradingPoint: Number(formData.GradingPoint),
          RuleId: ruleId,
        };
        
        const response2 = await customAxios.post('/GradingRule/InsertRuleItem', payload2);
        if (response2.status === 200) {
          const response = await customAxios.get('/GradingRule/GetList');
          showToast("Grading Items Inserted Successfully", "success");
          setInsertModalOpen(false); 
          setOriginalData(response?.data);
        }
      }
    } catch (error) {
      console.error("API Error:", error?.response || error.message);
      showToast(error?.response?.data?.message || "Something went wrong!", "error");
      handleCatchError(error, navigate);
    } finally {
      setIsBeingProcessed(false);
    }
  };

  return (
    <div className='absolute top-14 h-fit inset-0 z-20 bg-black bg-opacity-75 flex justify-center items-center'>
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
                type={field.type || "text"}
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                required={field.required}
              />
            </div>
          ))}
          
          <div className="flex justify-end gap-4">
            <button type="button" onClick={() => setFormData({ RuleId: 0 })} className="px-6 py-3 bg-red-700 text-white rounded-lg">Clear</button>
            {isBeingProcessed ? <CLoader /> : <button type="submit" className="px-6 py-3 bg-blue-900 text-white rounded-lg">Insert</button>}
          </div>
        </form>
      </div>
    </div>
  );
}

export default InsertGradingRule;
