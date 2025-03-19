import React, { useState } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Toaster, toast } from 'sonner';
import { ChevronDown } from "lucide-react";
import { duplicateForm, deleteForm, stopResponses, getForms } from "@/services/api";
import { Dialog, DialogTrigger, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

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

const FormsTable = ({ forms, loading }) => {
    const [selectedForm, setSelectedForm] = useState(null);
    const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false);
    const [isStopResponsesDialogOpen, setIsStopResponsesDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleDuplicate = async () => {
        try {
            await duplicateForm(selectedForm._id);
            toast.success("Form duplicated successfully");
            setIsDuplicateDialogOpen(false);
        } catch (error) {
            toast.error("Failed to duplicate form: " + error.message);
        }
    };

    const handleStopResponses = async () => {
        try {
            await stopResponses(selectedForm._id);
            toast.success("Form stopped receiving responses successfully");
            setIsStopResponsesDialogOpen(false);
        } catch (error) {
            toast.error("Failed to stop responses: " + error.message);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteForm(selectedForm._id);
            toast.success("Form deleted successfully");
            setIsDeleteDialogOpen(false);
        } catch (error) {
            toast.error("Failed to delete form: " + error.message);
        }
    };

    const columns = [
        { field: "autoId", headerName: "ID", width: 80, },
        { field: "title", headerName: "Title", flex: 1 },
        { field: "description", headerName: "Description", flex: 1 },
        { field: "visibility", headerName: "Visibility", flex: 1 },
        {
            field: "status", headerName: "Status", flex: 1,
            renderCell: (params) => (
                <span className={`px-2 py-1 h-max rounded-full text-xs  capitalize ${params.row.status === "published"
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                    }`}>
                    {params.row.status}
                </span>
            )
        },
        {
            field: "createdAt", headerName: "Created At", flex: 1,
            renderCell: (params) => (
                <span>{moment(params.row.createdAt).format("MMM DD, YYYY")}</span>
            )
        },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            renderCell: (params) => (
                <div className="">
                    <Link to={`/forms/form-builder/${params.row._id}`} className="">
                        <span className="px-5 py-1.5 border-y border border-gray-800 dark:border-gray-300 dark:text-gray-100 text-gray-800 rounded-l hover:bg-[#303030] hover:text-white transition-all">
                            View
                        </span>
                    </Link>

                    {/*  popover with options to duplicate, stop receiving responses, delete form */}
                    <Popover>
                        <PopoverTrigger>
                            <span className="px-5 py-1.5 border-y border-r border-gray-800 dark:border-gray-300 dark:text-gray-100 text-gray-800 rounded-r hover:bg-[#303030] hover:text-white transition-all">
                                More
                            </span>
                        </PopoverTrigger>
                        <PopoverContent>
                            <button
                                onClick={() => {
                                    setSelectedForm(params.row);
                                    setIsDuplicateDialogOpen(true);
                                }}
                                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors duration-300 ease-in-out cursor-pointer"
                            >
                                Duplicate
                            </button>
                            <button
                                onClick={() => {
                                    setSelectedForm(params.row);
                                    setIsStopResponsesDialogOpen(true);
                                }}
                                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors duration-300 ease-in-out cursor-pointer"
                            >
                                Stop responses
                            </button>
                            <button
                                onClick={() => {
                                    setSelectedForm(params.row);
                                    setIsDeleteDialogOpen(true);
                                }}
                                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors duration-300 ease-in-out cursor-pointer"
                            >
                                Delete
                            </button>
                        </PopoverContent>
                    </Popover>

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
                        rows={forms}
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

            {/* Duplicate Confirmation Dialog */}
            <Dialog open={isDuplicateDialogOpen} onOpenChange={setIsDuplicateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Duplicate Form</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to duplicate this form?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => setIsDuplicateDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleDuplicate}>Duplicate</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Stop Responses Confirmation Dialog */}
            <Dialog open={isStopResponsesDialogOpen} onOpenChange={setIsStopResponsesDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Stop Responses</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to stop receiving responses for this form?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => setIsStopResponsesDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleStopResponses}>Stop Responses</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Form</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this form? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default FormsTable;