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
import { getStockRequests } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { toast, Toaster } from "sonner";
import ViewRequest from "./ViewRequest";

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


const StockRequestTable = () => {
    const [stockRequests, setStockRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                const stockRequestsData = await getStockRequests();
                setStockRequests(stockRequestsData);
                setLoading(false);
            } catch (error) {
                toast.error('Failed to fetch data: ' + error.message);
                setError(error);
            }
        }
        fetchData();
    }, []);


    const columns = [
        { field: "autoId", headerName: "ID", width: 60 },
        { field: "request_title", headerName: "Title", flex: 1 },
        { field: "description", headerName: "Description", flex: 1 },
        { field: "requested_by", headerName: "Requested By", flex: 1 },
        {
            field: "items", headerName: "Items", flex: 1, renderCell: (params) => (
                <div className="flex flex-col gap-2">
                    {params.value.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <span>{item.item_name}</span>
                            <span>x{item.quantity}</span>
                        </div>
                    ))}
                </div>
            )
        },

        {
            field: "status", headerName: "Status", flex: 1, renderCell: (params) => (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${params.value === "approved"
                        ? "bg-green-500/20 text-green-500"
                        : params.value === "pending"
                            ? "bg-yellow-500/20 text-yellow-500"
                            : params.value === "rejected"
                                ? "bg-red-500/20 text-red-500"
                                : params.value === "Modified"
                                    ? "bg-blue-500/20 text-blue-500"
                                    : "bg-gray-500/20 text-gray-500"
                        }`}
                >
                    {params.value}
                </span>
            ),
        },
        {
            field: "created_at",
            headerName: "Created At",
            flex: 1,
            renderCell: (params) => moment(params.row.created_at).format('MMM D, YYYY hh:mm A'),

        },
        {
            field: "updated_at",
            headerName: "Updated At",
            flex: 1,
            renderCell: (params) => moment(params.row.updated_at).format('MMM D, YYYY hh:mm A'),

        },
        {
            field: "action",
            headerName: "Action",
            flex: 1,
            renderCell: (params) => {
                return (
                    <ViewRequest requestId={params.row._id} />
                );
            },
        },
    ];

    if (error) {
        return <div>Error: {error.message}</div>;
    }

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
                                        <th className="py-4 uppercase  text-xs px-4 ">Title</th>
                                        <th className="py-4 uppercase  text-xs px-4">Description</th>
                                        <th className="py-4 uppercase  text-xs px-4">Requested By</th>
                                        <th className="py-4 uppercase  text-xs px-4">Items</th>
                                        <th className="py-4 uppercase  text-xs px-4">Status</th>
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
                        rows={stockRequests}
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

export default StockRequestTable