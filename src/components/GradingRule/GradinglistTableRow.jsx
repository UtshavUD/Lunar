import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import customAxios from '../../utils/http';
import { showToast } from '../../utils/ReactToast';
import handleCatchError from '../../utils/handleCatchError';
import DeleteItem from '../DeleteItem';
import SeeAllGradingRule from './SeeAllGradingRule';
import UpdateGradingRule from './UpdateGradingRule';

function GradinglistTableRow({ index, data, setOriginalData}) {
  const navigate = useNavigate();
  const [isBeingProcessed, setIsBeingProcessed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isSeeAllModalOpen, setSeeAllModalOpen] = useState(false);


  // Handle modal boxes
  const handleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleEditModal = () => {
    setEditModalOpen(!isEditModalOpen);
  };

  const handleSeeAllModal = () => {
    setSeeAllModalOpen(!isSeeAllModalOpen);
  };

  // Handling the API request towards the endpoint
  const deleteHandle = async () => {
    try {
      setIsBeingProcessed(true);
      const response = await customAxios.delete(`/GradingRule/Block/${data.RuleId}`);
      if (response.status == 200) {
        // Remove the deleted data from originalData
        setOriginalData((prev) =>
          prev.filter((item) => item.RuleId !== data.RuleId)
        );

        handleModal();
        showToast("Data Blocked Successfully", "success");
      }

    } catch (error) {
      handleCatchError(error, navigate)
    }
    finally {
      setIsBeingProcessed(false);
    }
  }

  const updateHandle = async (formData) => {
    try {
        const response = await customAxios.put("/GradingRule/Update", formData);
        if (response.status === 200) {
            setOriginalData((prevData) =>
                prevData.map((item) => (item.RuleId === formData.RuleId ? formData : item))
            );
            return true; // ✅ Ensure success response
        }
    } catch (error) {
        console.error("Update failed:", error);
        showToast("Failed to update grading rule", "error");
    }
    return false;
};


  return (
    <>
<tr>
  <td className="px-3 py-5 whitespace-nowrap">{index + 1}</td>

  <td className="px-3 py-2 text-ellipsis whitespace-nowrap">
    {data?.RuleName?.length > 15 ? `${data?.RuleName.slice(0, 15)} ...` : data?.RuleName}
  </td>

  <td className="px-3 py-2 text-ellipsis whitespace-nowrap">
    {data?.RuleItems?.[0]?.GradingName?.length > 15 ? `${data?.RuleItems[0].GradingName.slice(0, 15)} ...` : data?.RuleItems?.[0]?.GradingName}
  </td>

  <td className="px-3 py-2 text-ellipsis whitespace-nowrap">
    {data?.RuleItems?.[0]?.GradingPoint ?? "N/A"}
  </td> 

  <td className="px-3 py-2 text-ellipsis whitespace-nowrap">
    {data?.RuleItems?.[0]?.GradingRemarks?.length > 15 ? `${data?.RuleItems[0].GradingRemarks.slice(0, 15)} ...` : data?.RuleItems?.[0]?.GradingRemarks}
  </td>

  <td className="px-3 py-2 text-ellipsis whitespace-nowrap">
    {data?.RuleItems?.[0]?.LowerLimit ?? "N/A"}
  </td>

  {/* <td className="px-3 py-2 whitespace-nowrap">
    <span className={`p-2 w-full inline-flex justify-center text-base font-semibold rounded-2xl ${data.IsActive ? 'bg-green-100' : 'bg-red-200'} text-black`}>
      {data.IsActive ? "Active" : "Blocked"}
    </span>
  </td> */}

  <td className="px-3 py-2 whitespace-nowrap flex space-x-2">
    {data.IsActive && (
      <>
        <button
          onClick={handleEditModal}
          title="Edit"
          className="px-2 py-1 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 transition duration-150 ease-in-out">
          <i className='bx bx-edit text-2xl'></i>
        </button>

        <button
          title="Block"
          onClick={handleModal}
          className="px-2 py-1 font-medium text-white bg-red-600 rounded-md hover:bg-red-500 transition duration-150 ease-in-out">
          <i className='bx bx-block text-2xl'></i>
        </button>
      </>
    )}

    <button
      title="See Details"
      onClick={handleSeeAllModal}
      className="px-2 py-1 font-medium text-white bg-green-600 rounded-md hover:bg-green-500 transition duration-150 ease-in-out">
      <i className='bx bx-info-circle text-2xl'></i>
    </button>
  </td>
</tr>

{/* Modals for Delete, Edit, and View Details */}
{isModalOpen && (
  <tr>
    <td colSpan={8}>
      <DeleteItem handleModal={handleModal} deleteHandle={deleteHandle} name={data.RuleName} isBeingProcessed={isBeingProcessed} />
    </td>
  </tr>
)}

{isEditModalOpen && (
  <tr>
    <td colSpan={8}>
      <UpdateGradingRule handleEditModal={handleEditModal} data={data} updateHandle={updateHandle} isBeingProcessed={isBeingProcessed} />
    </td>
  </tr>
)}

{isSeeAllModalOpen && (
  <tr>
    <td colSpan={8}>
      <SeeAllGradingRule index={index} handleSeeAllModal={handleSeeAllModal} data={data} />
    </td>
  </tr>
)}

    </>
  )
}
export default GradinglistTableRow;