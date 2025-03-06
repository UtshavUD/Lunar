import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import customAxios from '../../utils/http';
import { showToast } from '../../utils/ReactToast';
import handleCatchError from '../../utils/handleCatchError';
import DeleteItem from '../DeleteItem';
import UpdateSession from './UpdateGradelist';
import SeeAllSession from './SeeAllGradelist';

function GradelistTableRow({ index, data, setOriginalData}) {
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
      const response = await customAxios.delete(`/GradeList/Block/${data.GradeId}`);
      if (response.status == 200) {
        // Remove the deleted data from originalData
        setOriginalData((prev) =>
          prev.filter((item) => item.GradeId !== data.GradeId)
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
      setIsBeingProcessed(true);
      const response = await customAxios.put('/GradeList/Update', formData);
      if (response.status == 200) {
        const updatedData = response.data;

        
        

        // Update the originalData with the updated entry
        setOriginalData((prev) =>
          prev.map((item) =>
            item.GradeId === updatedData.GradeId ? updatedData : item
          )
        );

        handleEditModal();
        showToast("GradeList Updated Successfully", "success");
      }
    } catch (error) {
      handleCatchError(error, navigate);
    }
    finally {
      setIsBeingProcessed(false);
    }
  };

  return (
    <>
<tr>
        <td className="px-3 py-5 whitespace-nowrap">{index + 1}</td>
        <td className="px-3 py-2 text-ellipsis whitespace-nowrap">
          {data?.GradeName?.length > 15 ? (`${data?.GradeName.slice(0, 15)} ...`) : (data?.GradeName)}</td>
          
        <td className="px-3 py-2 text-ellipsis whitespace-nowrap">
          {data?.AreaName?.length > 15 ? (`${data?.AreaName.slice(0, 15)} ...`) : (data?.AreaName)}
        </td>

        <td className="px-3 py-2 text-ellipsis whitespace-nowrap">
          {data?.LevelName?.length > 15 ? (`${data?.LevelName.slice(0, 15)} ...`) : (data?.LevelName)}
        </td>
        <td className="px-3 py-2 text-ellipsis whitespace-nowrap">
          {data?.LevelName?.length > 15 ? (`${data?.TheoryPassPercent.slice(0, 15)} ...`) : (data?.TheoryPassPercent)}
        </td>
        <td className="px-3 py-2 text-ellipsis whitespace-nowrap">
          {data?.LevelName?.length > 15 ? (`${data?.PracticalPassPercent.slice(0, 15)} ...`) : (data?.PracticalPassPercent)}
        </td>
        <td className="px-3 py-2 whitespace-nowrap">{data?.GradeSheetCaption}</td>
        <td className="px-3 py-2 whitespace-nowrap">{data?.MarkSheetCaption}</td>

        <td className="px-3 py-2 whitespace-nowrap ">
          <span className={`p-4 w-full inline-flex justify-center text-base leading-5 font-semibold rounded-2xl ${data.IsActive ? 'bg-green-100' : 'bg-red-200'} text-black`}>{data.IsActive ? "Active" : "Blocked"}</span>
        </td>
        <td className="px-3 py-2 whitespace-nowrap flex justify-start">
          {
            data.IsActive && (
              <button
                onClick={handleEditModal}
                title="Edit"
                className="px-2 py-1 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:shadow-outline-blue active:bg-blue-600 transition duration-150 ease-in-out">
                <i className='bx bx-edit text-2xl' ></i>
              </button>
            )
          }
          {
            data.IsActive && 
              <button
                title="Block"
                onClick={handleModal}
                className={`ml-2 px-2 py-1 font-medium text-white bg-red-600 rounded-md hover:bg-red-500 focus:outline-none focus:shadow-outline-red active:bg-red-600 transition duration-150 ease-in-out`}>
                <i className='bx bx-block text-2xl mx-2' ></i>
              </button>
          }
          {/* See all details */}
          <button title="See Details" onClick={handleSeeAllModal} className={`ml-2 px-2 py-1 font-medium text-white bg-green-600 rounded-md hover:bg-green-500 focus:outline-none focus:shadow-outline-green active:bg-green-600 transition duration-150 ease-in-out`}><i className='bx bx-info-circle text-2xl' ></i></button>

        </td>

      </tr>
      <tr>
        {isModalOpen && <td>
          <DeleteItem handleModal={handleModal} deleteHandle={deleteHandle} name={data.GradeName} isBeingProcessed={isBeingProcessed} />
        </td>
        }

        {isEditModalOpen && <td>
          <UpdateSession handleEditModal={handleEditModal} data={data} updateHandle={updateHandle} isBeingProcessed={isBeingProcessed} />
        </td>
        }

        {isSeeAllModalOpen && <td>
          <SeeAllSession index={index} handleSeeAllModal={handleSeeAllModal} data={data} />
        </td>
        }
      </tr>
    </>
  )
}
export default GradelistTableRow;