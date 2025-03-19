import React, { useEffect, useState } from "react";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarQuickFilter,
  GridToolbarFilterButton,
  GridToolbarDensitySelector
} from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import moment from "moment";
import { getAgents } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster, toast } from 'sonner';
function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarQuickFilter />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          flex: 1,
          justifyContent: "flex-end",
        }}
      >
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport printOptions={{ disableToolbarButton: true }} />
      </div>
    </GridToolbarContainer>
  );
}



const AgentsTable = () => {

  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const agentsData = await getAgents();
        setAgents(agentsData);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to fetch data: ' + error.message);
        setError(error);
      }
    };
    fetchData();
  }, []);


  const columns = [
    {
      field: "autoId",
      headerName: "ID",
      width: 30,

    },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "phone", headerName: "Phone", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "address", headerName: "Address", flex: 1 },
    { field: "regionDescription", headerName: "Region", flex: 1 },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1,
      renderCell: (params) => moment(params.row.createdAt).format('MMM D, YYYY hh:mm A'),
    },
   
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <div className="flex items-center space-x-2">
          <Link to={`/agents/${params.row._id}`}>
            <span className="px-5 py-1.5 border border-gray-800 dark:border-gray-300 dark:text-gray-100 text-gray-800 rounded hover:bg-[#303030] hover:text-white transition-all">
              View
            </span>
          </Link>
        </div>
      ),
    },
  ];
  return (
    <div
      className="bg-card dark:bg-[#303030] rounded-[10px] mt-5"
      style={{
        height: "100%",
        width: "100%",

        display: "flex",
        flexDirection: "column",
      }}
    >
      {
        loading ? (
          <div className="flex flex-col gap-4 p-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-10 w-40" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-20" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="w-full text-left font-medium text-neutral-800 dark:text-gray-200 bg-white dark:bg-gray-300/20 ">
                    <th className="py-4 uppercase  text-xs px-4 ">ID</th>
                    <th className="py-4 uppercase  text-xs px-4">Name</th>
                    <th className="py-4 uppercase  text-xs px-4">Phone</th>
                    <th className="py-4 uppercase  text-xs px-4">Email</th>
                    <th className="py-4 uppercase  text-xs px-4">Address</th>
                    <th className="py-4 uppercase  text-xs px-4 ">Created At</th>
                    <th className="py-4 uppercase  text-xs px-4 ">Updated At</th>
                    <th className="py-4 uppercase  text-xs px-4 ">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index} className="hover:bg-gray-100/35 text-sm space-y-6 dark:hover:bg-gray-800">
                      <td className="py-5 px-4"><Skeleton className="h-4 w-3/4" /></td>
                      <td className="py-5 px-4"><Skeleton className="h-4 w-1/2" /></td>
                      <td className="py-5 px-4"><Skeleton className="h-4 w-1/2" /></td>
                      <td className="py-5 px-4"><Skeleton className="h-4 w-1/4" /></td>
                      <td className="py-5 px-4"><Skeleton className="h-4 w-1/2" /></td>
                      <td className="py-5 px-4"><Skeleton className="h-4 w-1/4" /></td>
                      <td className="py-5 px-4"><Skeleton className="h-4 w-1/4" /></td>
                      <td className="py-5 px-4"><Skeleton className="h-4 w-1/4" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <DataGrid
            rows={agents}
            columns={columns}
            getRowId={(row) => row._id}
            disableRowSelectionOnClick
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            checkboxSelection
            pageSizeOptions={[10, 20, 30, 40, 100]}
            clipboardCopyCellDelimiter=" "
            slots={{
              toolbar: CustomToolbar,
            }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
          />
        )
      }
      <Toaster richColors />
    </div>
  )
}

export default AgentsTable