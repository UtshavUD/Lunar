import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import customAxios from '../../utils/http';
import { showToast } from '../../utils/ReactToast';
import handleCatchError from '../../utils/handleCatchError';
import DeleteItem from '../DeleteItem';
import SeeAllRole from './SeeAllRole';
import UpdateRole from './UpdateRole';

function RoleTableRow({ index, data, setOriginalData }) {
  const navigate = useNavigate();
  const [isBeingProcessed, setIsBeingProcessed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isSeeAllModalOpen, setSeeAllModalOpen] = useState(false);

  //Hande modal boxes
  const handleModal = () => {
    setIsModalOpen(!isModalOpen);
  }

  const handleEditModal = () => {
    setEditModalOpen(!isEditModalOpen);
  }

  const handleSeeAllModal = () => {
    setSeeAllModalOpen(!isSeeAllModalOpen);
  }

  //handling the api request towards the endpoint
  const deleteHandle = async () => {
    try {
      setIsBeingProcessed(true);
      const response = await customAxios.delete(`/role/Block/${data.RoleId}`);
      if (response.status == 200) {
        // Remove the deleted data from originalData
        setOriginalData((prev) =>
          prev.filter((item) => item.RoleId !== data.RoleId)
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
      const response = await customAxios.put('/role/update', formData);
      if (response.status == 200) {
        const updatedData = await response.data;

        // Update the originalData with the updated entry
        setOriginalData((prev) =>
          prev.map((item) =>
            item.RoleId === updatedData.RoleId ? updatedData : item
          )
        );

        handleEditModal();
        showToast("Role Updated Successfully", "success");
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
        <td className="px-3 py-2 whitespace-nowrap">{index + 1}</td>
        <td className="px-3 py-2 text-ellipsis whitespace-nowrap cursor-pointer">
          {data?.RoleName?.length > 25 ? (`${data?.RoleName.slice(0, 25)} ...`) : (data?.RoleName)}
        </td>

        <td className="px-3 py-2 text-ellipsis whitespace-nowrap cursor-pointer">
          {data?.Remarks?.length > 25 ? (`${data?.Remarks.slice(0, 25)} ...`) : (data?.Remarks)}
        </td>

        <td className="px-3 py-2 whitespace-nowrap text-center">
          <span className={`px-6 py-4 w-fit inline-flex justify-center text-base leading-5 font-semibold rounded-full ${data.IsActive ? 'bg-green-100' : 'bg-red-200'} text-black`}>{data.IsActive ? "Active" : "Blocked"}</span>
        </td>
        <td className="px-3 py-2 whitespace-nowrap text-center">
          {
            data.IsActive && (
              <button
                title="Edit"
                onClick={handleEditModal}
                className="px-2 py-1 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:shadow-outline-blue active:bg-blue-600 transition duration-150 ease-in-out">
                <i className='bx bx-edit text-2xl' ></i>
              </button>
            )
          }
          {
            data.IsActive && (
              <button
                title="Block"
                onClick={handleModal}
                className={`ml-2 px-2 py-1 font-medium text-white bg-red-600 rounded-md hover:bg-red-500 focus:outline-none focus:shadow-outline-red active:bg-red-600 transition duration-150 ease-in-out`}>
                <i className='bx bx-block text-2xl' ></i>
              </button>)
          }
          {/* See all details */}
          <button
            title="See Details"
            onClick={handleSeeAllModal}
            className={`ml-2 px-2 py-1 font-medium text-white bg-green-600 rounded-md hover:bg-green-500 focus:outline-none focus:shadow-outline-green active:bg-green-600 transition duration-150 ease-in-out`}>
            <i className='bx bx-info-circle text-2xl' ></i>
          </button>

        </td>

      </tr>
      
      <tr>
        {isModalOpen && <td>
          <DeleteItem handleModal={handleModal} deleteHandle={deleteHandle} name={data?.RoleName} isBeingProcessed={isBeingProcessed}/>
        </td>}

        {isEditModalOpen && <td>
            <UpdateRole handleEditModal={handleEditModal} data={data} updateHandle={updateHandle} isBeingProcessed={isBeingProcessed} />
        </td>}

        {isSeeAllModalOpen && <td>
          <SeeAllRole index={index} handleSeeAllModal={handleSeeAllModal} data={data} />
        </td>}

      </tr>

    </>
  )
}

export default RoleTableRow
