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
import { getActivities } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { toast, Toaster } from "sonner";
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



const ActivitiesTable = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const activitiesData = await getActivities();
        setActivities(activitiesData);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to fetch data: ' + error.message);
        setError(error);
      }
    }
    fetchData();
  }, []);


  const columns = [
    { field: "autoId", headerName: "ID", width: 90 },
    { field: "title", headerName: "Title", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      type: "singleSelect",
      renderCell: (params) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${params.value === "Completed"
            ? "bg-green-500/20 text-green-500"
            : params.value === "In Progress"
              ? "bg-yellow-500/20 text-yellow-500"
              : params.value === "Upcoming"
                ? "bg-blue-500/20 text-blue-500"
              : params.value === "Pending"
                ? "bg-orange-500/20 text-orange-500"
                : "bg-gray-500/20 text-gray-500"
            }`}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "startDate",
      headerName: "Start Date",
      flex: 1,
      renderCell: (params) => moment(params.row.startDate).format('MMM D, YYYY hh:mm A'),

    },
    {
      field: "endDate",
      headerName: "End Date",
      flex: 1,
      renderCell: (params) => moment(params.row.endDate).format('MMM D, YYYY hh:mm A'),

    },
    {
      field: "createdBy",
      headerName: "Created By",
      flex: 1,
      renderCell: (params) => params.row.createdBy?.name || 'Unknown',
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1,
      renderCell: (params) => moment(params.row.createdAt).format('MMM D, YYYY hh:mm A'),

    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      flex: 1,
      renderCell: (params) => moment(params.row.updatedAt).format('MMM D, YYYY hh:mm A'),

    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <div className="flex items-center space-x-2">
          <Link to={`/activities/${params.row._id}`}>
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
      className="bg-card dark:bg-[#303030] rounded-[10px]"
      style={{
        height: "100%",
        width: "100%",

        display: "flex",
        flexDirection: "column",
      }}
    >
      <Toaster richColors />
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
                    <th className="py-4 uppercase  text-xs px-4 ">Activity Name</th>
                    <th className="py-4 uppercase  text-xs px-4">Start Date</th>
                    <th className="py-4 uppercase  text-xs px-4">End Date</th>
                    <th className="py-4 uppercase  text-xs px-4">Status</th>
                    <th className="py-4 uppercase  text-xs px-4">Created Date</th>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <DataGrid
            rows={activities?.activities}
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

    </div>
  )
}

export default ActivitiesTable