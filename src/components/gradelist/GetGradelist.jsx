import React, { useEffect, useState } from "react";
import customAxios from "../../utils/http";
import Loader from "../../utils/Loader";
import { Link, useNavigate } from "react-router-dom";
import handleCatchError from "../../utils/handleCatchError";
import InsertGradelist from "./InsertGradelist";
import GradelistTableRow from "./GradelistTableRow";
import GradelistCard from "./GradelistCard";



function GetGradelist() {
  const navigate = useNavigate();

  const [originalData, setOriginalData] = useState([]); // Store original data
  const [filteredData, setFilteredData] = useState([]); // Displayed data
  const [isInsertModalOpen,setInsertModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [showBlocked, setShowBlocked] = useState(false);
  const [isBlockedFetched, setIsBlockedFetched] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterColumn, setFilterColumn] = useState("default");
  const [sortOrder, setSortOrder] = useState("default");

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);

  // Fetch active data initially
  const fetchActiveData = async () => {
    try {
      setIsLoading(true);
      const response = await customAxios.get(`/GradeList/GetList`);
      const data = await response.data;
      console.log(data)
      setOriginalData(data);
      setFilteredData(data.filter((item) => item.IsActive));
    } catch (error) {
      handleCatchError(error, navigate);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch blocked data when toggled
  const fetchBlockedData = async () => {
    try {
      setIsLoading(true);
      const response = await customAxios.get(`/GradeList/GetList/true`);
      const data = await response.data;
      setOriginalData(data);
      setFilteredData(data.filter((item) => !item.IsActive));
      setIsBlockedFetched(true);
    } catch (error) {
      handleCatchError(error, navigate);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle blocked data view
  const handleBlockList = () => {
    if (!isBlockedFetched && !showBlocked) {
      fetchBlockedData();
    } else {
      const updatedData = showBlocked
        ? originalData.filter((item) => item.IsActive)
        : originalData.filter((item) => !item.IsActive);
      setFilteredData(updatedData);
    }
    setShowBlocked(!showBlocked);
    setCurrentPage(1);
  };

  useEffect(() => {
    document.title = "Grade-List";
    fetchActiveData();
  }, []);

  useEffect(() => {
    const updatedData = showBlocked
      ? originalData.filter((item) => !item.IsActive)
      : originalData.filter((item) => item.IsActive);
    setFilteredData(updatedData);
    setFilterColumn("default");
    setSortOrder("default");
    setSearchQuery("");
  }, [showBlocked, originalData]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  
    const baseData = showBlocked
      ? originalData.filter((item) => !item.IsActive)
      : originalData.filter((item) => item.IsActive);
  
    const filtered = baseData.filter((item) =>
      Object.values(item).some((value) =>
        String(value || "").toLowerCase().includes(query)
      )
    );
  
    console.log("Filtered Data:", filtered);
  
    setFilteredData(filtered);
    setCurrentPage(1);
  };
  

  const handleFilterAndSort = () => {
    let updatedData = [...filteredData];

    if (filterColumn !== "default") {
      updatedData = filteredData.filter((item) =>
        item[filterColumn]
          ?.toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }

    if (sortOrder !== "default" && filterColumn !== "default") {
      updatedData.sort((a, b) => {
        const valueA = a[filterColumn]?.toString().toLowerCase();
        const valueB = b[filterColumn]?.toString().toLowerCase();
        return sortOrder === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      });
    }

    setFilteredData(updatedData);
    setCurrentPage(1);
  };

  useEffect(() => {
    handleFilterAndSort();
  }, [filterColumn, sortOrder, searchQuery]);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="overflow-x-auto">
          <div className="flex justify-center min-[750px]:justify-end gap-8">
              <button 
                onClick={()=> setInsertModalOpen(true)}
                className="bg-green-700 text-white p-4 rounded-xl flex gap-2 items-center">
                <i className="bx bx-plus-medical"></i>Insert
              </button>
            {
              isInsertModalOpen &&
              <InsertGradelist
                  setOriginalData={setOriginalData}
                  setInsertModalOpen={setInsertModalOpen} />
            }
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="rounded-xl w-4 h-4 cursor-pointer"
                onChange={handleBlockList}
                checked={showBlocked}
              />
              <p>Show Blocked</p>
            </div>
          </div>

          <div className="text-3xl text-center font-semibold font-serif mb-5">
            Grade-List
          </div>

          <div className="flex justify-between items-center mt-4 mb-2 gap-4 flex-wrap w-full">
            <input
              type="text"
              className="border p-2 rounded w-screen min-[440px]:w-auto"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearch}
            />
            <select
              className="border p-2 rounded cursor-pointer"
              onChange={(e) => setFilterColumn(e.target.value)}
              value={filterColumn}
            >
              <option value="default" disabled>
                --Filter by Column--
              </option>
              <option value="GradeId">Id</option>
              <option value="GradeName">GradeName</option>
              <option value="AreaName">AreaName</option>
              <option value="LevelName">LevelName</option>
              <option value="TheoryPassPercent">Theory Pass%</option>
              <option value="PracticalPassPercent">Practical Pass%</option>

              <option value="GradeSheetCaption">GradeSheeet Caption</option> 
              <option value="MarkSheetCaption">MarkSheet Caption</option>

              <option value="IsActive">Status</option>
              
            
            </select>
            <select
              className="border p-2 rounded cursor-pointer"
              onChange={(e) => setSortOrder(e.target.value)}
              value={sortOrder}
            >
              <option value="default" disabled>--Sort Order--</option>
              <option value="asc" disabled={filterColumn === "default"}>Ascending</option>
              <option value="desc" disabled={filterColumn === "default"}>Descending</option>
            </select>
          </div>

          <table className="min-w-full divide-y divide-gray-200 hidden min-[750px]:table">
            <thead className="border">
              <tr>
                <th className="px-3 p-4  text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Id</th>
                <th className="px-3 p-4  text-left text-xs font-medium text-gray-500 uppercase">Grade Name</th>
                <th className="px-3 p-4  text-left text-xs font-medium text-gray-500 uppercase">Area Name</th>
                <th className="px-3 p-4  text-left text-xs font-medium text-gray-500 uppercase">Level Name</th>
                <th className="px-3 p-4  text-left text-xs font-medium text-gray-500 uppercase">(th)Pass%</th>
                <th className="px-3 p-4  text-left text-xs font-medium text-gray-500 uppercase">(pr)Pass%</th>
                <th className="px-3 p-4  text-left text-xs font-medium text-gray-500 uppercase">Grade-Sheet Caption</th>
                <th className="px-3 p-4  text-left text-xs font-medium text-gray-500 uppercase">Mark-Sheet Caption</th>
                <th className="px-3 p-4  text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-3 p-4  text-left text-xs font-medium text-gray-500 uppercase ">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentRows.length === 0 ? (
                <tr>
                  <td colSpan={7}>No data available</td>
                </tr>
              ) : (
                currentRows.map((data, index) => (
                  <GradelistTableRow
                  refetch={fetchBlockedData}
                    key={data.GradeId}
                    index={indexOfFirstRow + index}
                    data={data}
                    setOriginalData={setOriginalData}
                  />
                ))
              )}
            </tbody>
          </table>

          {/* Card view for mobile */}
          <div className="visible min-[750px]:hidden flex flex-col">
            {
              currentRows.length === 0 ? (
                <div>
                  <p className="text-3xl my-5 bg-red-200 py-20 text-center rounded-3xl">
                    No data available
                  </p>
                </div>
              ) : (
                currentRows.map((data, index) => {
                  return (
                    <GradelistCard
                      key={data.SessionId}
                      index={indexOfFirstRow + index}
                      data={data}
                      setOriginalData={setOriginalData} />
                  )
                })
              )
            }
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="p-2 border rounded disabled:bg-blue-300 bg-blue-600 disabled:hover:bg-blue-300 text-white hover:bg-blue-800 "
            >
              Previous
            </button>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, idx) => (
                <button
                  key={idx + 1}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`p-2 border rounded ${currentPage === idx + 1 ? "bg-blue-600 text-white" : "hover:bg-blue-800 hover:text-white"
                    }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="p-2 border rounded disabled:bg-blue-300 bg-blue-600 disabled:hover:bg-blue-300 text-white hover:bg-blue-800"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default GetGradelist;