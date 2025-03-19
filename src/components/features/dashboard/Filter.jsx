import DateRangePicker from "@/components/ui/date-range-picker";
import React from "react";



const Filter = ({ filters, handleFilterChange }) => {

  const handleStatusChange = (e) => {
    handleFilterChange({ ...filters, status: e.target.value });
    console.log(e.target.value);
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    handleFilterChange({ ...filters, dateRange: { ...filters.dateRange, [name]: value } });
  };

  return (
    <div className="flex space-x-4 items-center">
      <select value={filters.status} onChange={handleStatusChange} className=" dark:bg-[#161616] p-2 border border-gray-100 dark:border-gray-700 dark:text-gray-300 rounded-[40px] bg-[#fcfbfc83] outline-none">
        <option value="All">All</option>
        <option value="Active">Active</option>
        <option value="Paused">Paused</option>
        <option value="Completed">Completed</option>
      </select>
 
      <DateRangePicker
        onUpdate={handleDateChange}
        initialDateFrom="2025-01-01"
        initialDateTo={new Date()}
        align="start"
        locale="en-GB"
        showCompare={false}
      />
    </div>
  );
};

export default Filter;