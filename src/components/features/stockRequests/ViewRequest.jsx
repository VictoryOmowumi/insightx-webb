import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../ui/dialog';
import { Button } from '@/components/ui/button';
import { getStockRequestById, updateStockRequest, getStockRequestHistory, getStockRequests } from '@/services/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Trash2, Edit3Icon } from 'lucide-react';
import moment from 'moment';



const ViewRequest = ({ requestId }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [request, setRequest] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [modifiedItems, setModifiedItems] = useState([]);
  const [itemsToAdd, setItemsToAdd] = useState([]);
  const [itemsToRemove, setItemsToRemove] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (isDialogOpen) {
      setLoading(true);
      const fetchData = async () => {
        try {
          const request = await getStockRequestById(requestId);
          setRequest(request);
          setModifiedItems(request.items); // Initialize modified items
          const historyData = await getStockRequestHistory(requestId);
          setHistory(historyData);
          setLoading(false);
        } catch (error) {
          toast.error('Failed to fetch data: ' + error.message);
          setError(error);
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [requestId, isDialogOpen]);

  const handleModify = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    for (const item of modifiedItems) {
      if (!item.item_name || !item.quantity || !item.purpose) {
        toast.error('All item fields (name, quantity, purpose) are required.');
        return;
      }
    }

    setSaving(true);
    try {
      const updatedRequest = {
        ...request,
        items: {
          add: itemsToAdd,
          remove: itemsToRemove,
          update: modifiedItems,
        },
        status: 'modified',
        action: 'modified',
        updated_at: new Date(),
      };
      await updateStockRequest(requestId, updatedRequest);
      await getStockRequests();
      const updatedItems = modifiedItems.filter((item) => !itemsToRemove.includes(item));


      setModifiedItems(updatedItems);

      setSaving(false);
      toast.success('Request modified successfully');
      setIsEditing(false);
      setIsDialogOpen(false);
    } catch (error) {
      setSaving(false);
      toast.error('Failed to modify request');
    }
  };



  const handleApprove = async () => {
    setApproving(true);
    try {
      const updatedRequest = { ...request, status: 'approved', action: 'approved' };
      await updateStockRequest(requestId, updatedRequest);
      setApproving(false);
      toast.success('Request approved successfully');
      setIsDialogOpen(false);
    } catch (error) {
      setApproving(false);
      toast.error('Failed to approve request');
    }
  };

  const handleReject = async () => {
    setRejecting(true);
    try {
      const updatedRequest = { ...request, status: 'rejected', action: 'rejected' };
      await updateStockRequest(requestId, updatedRequest);
      setRejecting(false);
      toast.success('Request rejected successfully');
      setIsDialogOpen(false);
    } catch (error) {
      setRejecting(false);
      toast.error('Failed to reject request');
    }
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...modifiedItems];
    updatedItems[index][field] = value;
    updatedItems[index]._id = modifiedItems[index]._id; // Ensure the id is preserved
    setModifiedItems(updatedItems);
  };

  const handleRemoveItem = (index) => {
    const itemToRemove = modifiedItems[index];
    setItemsToRemove([...itemsToRemove, itemToRemove]);
    const updatedItems = modifiedItems.filter((_, i) => i !== index);
    setModifiedItems(updatedItems);
  };

  const handleAddItem = () => {
    const newItem = { item_name: '', quantity: '', purpose: '' };
    console.log('New Item:', newItem);
    setItemsToAdd([...itemsToAdd, newItem]);
    setModifiedItems([...modifiedItems, newItem]);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center">
          <Button className="mt-2 !bg-transparent">
            <span className="px-5 py-1.5 border border-gray-800 dark:border-gray-300 dark:text-gray-100 text-gray-800 rounded hover:bg-[#303030] hover:text-white transition-all">
              View
            </span>
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-6xl overflow-y-scroll h-[90vh]">
        <DialogHeader>
          <DialogTitle>View Stock Request</DialogTitle>
          <DialogDescription>
            Review and manage the stock request.
          </DialogDescription>
        </DialogHeader>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : error ? (
          <p className="text-red-500">Error: {error.message}</p>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Requested By</label>
              <Input value={request.requested_by} readOnly />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Request Title</label>
              <Input value={request.request_title} readOnly />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Input value={request.description} readOnly />
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Items</h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    <th className="p-2 text-left">Item Name</th>
                    <th className="p-2 text-left">Quantity</th>
                    <th className="p-2 text-left">Purpose</th>
                    {isEditing && <th className="p-2 text-left">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {modifiedItems.map((item, index) => (
                    <tr key={item._id} className="border-b">
                      <td className="p-2">
                        <Input
                          value={item.item_name}
                          onChange={(e) =>
                            handleItemChange(index, 'item_name', e.target.value)
                          }
                          readOnly={!isEditing}
                          className="w-full"
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemChange(index, 'quantity', e.target.value)
                          }
                          readOnly={!isEditing}
                          type="number"
                          className="w-full"
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          value={item.purpose}
                          onChange={(e) =>
                            handleItemChange(index, 'purpose', e.target.value)
                          }
                          readOnly={!isEditing}
                          className="w-full"
                        />
                      </td>
                      {isEditing && (
                        <td className="p-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(index)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              {isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddItem}
                  className="w-full"
                >
                  Add Item
                </Button>
              )}
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">History</h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    <th className="p-2 text-left">Action</th>
                    <th className="p-2 text-left">Action By</th>
                    <th className="p-2 text-left">Action At</th>
                  </tr>
                </thead>
                <tbody>
                  {history.slice(0, 5).map((entry) => (
                    <tr key={entry._id} className="border-b">
                      <td className="p-2">{entry.action}</td>
                      <td className="p-2">{entry.action_by.name}</td>
                      <td className="p-2">{moment(entry.action_at).format('MMM D, YYYY hh:mm A')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <DialogFooter className="flex justify-end gap-2">
              {isEditing ? (
                <>
                  <Button type="button" className="!bg-transparent border text-black" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button type="button" onClick={handleSave}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </>
              ) : (
                <>
                  {request.status === 'rejected' || request.status === 'approved' ? (
                    <div className="flex w-full items-center justify-center mt-4 p-2 bg-blue-500/20 text-blue-500 border border-blue-500 rounded-md text-center">
                    <p className="">This request has been {request.status} and cannot be modified.
                    </p>
                    </div>
                  ) : (
                    <>
                      <Button type="button" onClick={handleModify}>
                        <Edit3Icon size={16} />
                        Modify
                      </Button>
                      <Button
                        type="button"
                        variant="success"
                        onClick={handleApprove}
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 18c-.663 0-1.298-.294-1.767-.815A2.944 2.944 0 0 1 0 15.222V8.777c0-.737.263-1.443.732-1.964C1.202 6.293 1.837 6 2.5 6s1.299.293 1.768.813A2.94 2.94 0 0 1 5 8.777v6.445c0 .737-.264 1.443-.733 1.963-.469.521-1.104.814-1.767.815zm0-10.308a.934.934 0 0 0-.693.319c-.183.204-.287.48-.287.77v6.445c0 .288.103.565.287.77.184.204.433.319.693.32.26-.001.51-.116.693-.32.183-.205.287-.482.287-.77V8.78c0-.143-.025-.285-.074-.417a1.105 1.105 0 0 0-.212-.354.981.981 0 0 0-.318-.237.897.897 0 0 0-.376-.084v.004z" fill="currentColor"></path><path d="M10.352 18H7.564a3.539 3.539 0 0 1-2.519-1.062A3.658 3.658 0 0 1 4 14.378V8.281c0-.884.177-1.76.523-2.572l1.911-4.502c.142-.334.371-.622.662-.834A1.949 1.949 0 0 1 9.122.21c.32.163.59.411.782.719l.171.271c.194.312.298.673.298 1.041v1.755c0 .341.134.669.371.91.238.242.56.378.896.378h2.691a3.64 3.64 0 0 1 2.594 1.092A3.76 3.76 0 0 1 18 9.014a7.267 7.267 0 0 1-1.288 4.147l-1.602 2.325a5.84 5.84 0 0 1-2.076 1.848 5.735 5.735 0 0 1-2.682.666zM8.245 1.648h-.03a.331.331 0 0 0-.293.212L6.012 6.36a4.882 4.882 0 0 0-.39 1.92v6.095c0 .524.205 1.026.569 1.396.364.37.858.579 1.373.58h2.788c.672-.001 1.335-.166 1.931-.481a4.208 4.208 0 0 0 1.495-1.332l1.603-2.324a5.616 5.616 0 0 0 .994-3.201 2.1 2.1 0 0 0-.6-1.472 2.031 2.031 0 0 0-1.448-.61h-2.691c-.766-.001-1.5-.31-2.042-.861a2.964 2.964 0 0 1-.847-2.075V2.241a.297.297 0 0 0-.046-.16l-.17-.272a.334.334 0 0 0-.286-.16z" fill="currentColor"></path></svg>
                        {approving ? 'Approving...' : 'Approve'}
                      </Button>
                      <Button type="button" variant="destructive" className="cursor-pointer" onClick={handleReject}>
                        <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><clipPath id="clip1348_20218"><rect id="点踩0718" width="20.000000" height="20.000000" fill="white" fill-opacity="0"></rect></clipPath></defs><rect id="点踩0718" width="20.000000" height="20.000000" fill="#FFFFFF" fill-opacity="0"></rect><g clip-path="url(#clip1348_20218)"><path id="path" d="M3.71 13.17C3.53 13.17 3.36 13.16 3.18 13.12C3.01 13.09 2.84 13.04 2.67 12.97C2.51 12.9 2.35 12.82 2.2 12.72C2.05 12.62 1.92 12.51 1.79 12.38C1.66 12.25 1.55 12.12 1.45 11.97C1.35 11.82 1.27 11.67 1.2 11.5C1.13 11.34 1.08 11.17 1.05 11C1.01 10.82 1 10.65 1 10.47L1 4.19C1 4.02 1.02 3.84 1.06 3.67C1.09 3.5 1.15 3.33 1.22 3.17C1.29 3.01 1.37 2.86 1.47 2.71C1.57 2.57 1.68 2.43 1.81 2.31C1.93 2.19 2.07 2.08 2.22 1.98C2.36 1.88 2.52 1.8 2.68 1.74C2.84 1.67 3.01 1.62 3.19 1.59C3.36 1.55 3.53 1.54 3.71 1.54C3.89 1.54 4.06 1.55 4.23 1.59C4.41 1.62 4.57 1.67 4.74 1.74C4.9 1.8 5.06 1.88 5.2 1.98C5.35 2.08 5.49 2.19 5.61 2.31C5.74 2.43 5.85 2.57 5.95 2.71C6.05 2.86 6.13 3.01 6.2 3.17C6.27 3.33 6.33 3.5 6.36 3.67C6.4 3.84 6.42 4.02 6.42 4.19L6.42 10.47C6.42 10.65 6.41 10.82 6.37 11C6.34 11.17 6.28 11.34 6.22 11.5C6.15 11.67 6.06 11.82 5.97 11.97C5.87 12.12 5.75 12.25 5.63 12.38C5.5 12.51 5.36 12.62 5.22 12.72C5.07 12.82 4.91 12.9 4.75 12.97C4.58 13.04 4.41 13.09 4.24 13.12C4.06 13.16 3.89 13.17 3.71 13.17ZM3.71 3.14C3.57 3.14 3.43 3.16 3.3 3.22C3.17 3.27 3.06 3.35 2.96 3.45C2.86 3.54 2.78 3.66 2.73 3.79C2.67 3.92 2.65 4.05 2.64 4.2L2.64 10.47C2.64 10.62 2.66 10.75 2.72 10.89C2.77 11.02 2.85 11.14 2.95 11.24C3.05 11.34 3.16 11.42 3.29 11.48C3.43 11.54 3.57 11.56 3.71 11.56C3.85 11.56 3.99 11.54 4.12 11.48C4.26 11.42 4.37 11.34 4.47 11.24C4.57 11.14 4.65 11.02 4.7 10.89C4.75 10.75 4.78 10.62 4.77 10.47L4.77 4.2C4.77 4.05 4.75 3.92 4.69 3.79C4.64 3.66 4.56 3.54 4.46 3.44C4.36 3.34 4.25 3.27 4.12 3.21C3.99 3.16 3.85 3.14 3.71 3.14Z" fill="currentColor" fill-opacity="1.000000" fill-rule="nonzero"></path><path id="path" d="M9.09 18.95C9.04 18.95 8.99 18.95 8.93 18.95C8.75 18.93 8.57 18.89 8.4 18.83C8.23 18.77 8.07 18.69 7.92 18.58C7.78 18.48 7.64 18.35 7.53 18.21C7.42 18.07 7.32 17.92 7.25 17.75L5.31 13.26C4.95 12.44 4.77 11.58 4.77 10.69L4.77 4.61C4.77 4.37 4.8 4.14 4.84 3.9C4.89 3.67 4.96 3.45 5.05 3.23C5.14 3.01 5.25 2.8 5.39 2.6C5.52 2.4 5.67 2.22 5.84 2.05C6.01 1.89 6.19 1.74 6.39 1.61C6.58 1.47 6.79 1.36 7.01 1.27C7.23 1.18 7.46 1.11 7.69 1.07C7.93 1.02 8.16 1 8.4 1L11.24 1C11.71 1 12.18 1.05 12.64 1.16C13.1 1.28 13.54 1.44 13.97 1.66C14.39 1.88 14.78 2.14 15.13 2.46C15.49 2.77 15.8 3.12 16.08 3.5L17.71 5.82C18.13 6.43 18.46 7.08 18.68 7.79C18.91 8.5 19.02 9.22 19.02 9.96C19.02 10.21 18.99 10.45 18.95 10.69C18.9 10.93 18.83 11.16 18.73 11.38C18.64 11.61 18.53 11.82 18.39 12.03C18.25 12.23 18.1 12.42 17.92 12.59C17.75 12.76 17.56 12.92 17.36 13.05C17.15 13.19 16.94 13.3 16.71 13.4C16.49 13.49 16.25 13.56 16.01 13.61C15.77 13.66 15.53 13.68 15.28 13.68L12.54 13.68C12.37 13.68 12.21 13.71 12.05 13.78C11.89 13.84 11.75 13.94 11.63 14.06C11.51 14.18 11.42 14.32 11.35 14.48C11.29 14.63 11.26 14.8 11.26 14.97L11.26 16.71C11.25 17.09 11.15 17.43 10.95 17.75L10.78 18.02C10.6 18.31 10.36 18.54 10.06 18.7C9.76 18.87 9.43 18.95 9.09 18.95ZM8.4 2.64C8.27 2.64 8.14 2.65 8.01 2.68C7.88 2.7 7.76 2.74 7.64 2.79C7.52 2.84 7.41 2.9 7.3 2.97C7.19 3.04 7.09 3.12 7 3.21C6.91 3.31 6.83 3.41 6.75 3.51C6.68 3.62 6.62 3.73 6.57 3.85C6.52 3.97 6.48 4.1 6.46 4.22C6.43 4.35 6.42 4.48 6.42 4.61L6.42 10.69C6.42 11.35 6.55 11.99 6.82 12.6L8.76 17.1C8.82 17.23 8.92 17.3 9.06 17.31C9.2 17.32 9.31 17.26 9.39 17.14L9.56 16.87C9.59 16.83 9.61 16.77 9.61 16.71L9.61 14.96C9.61 14.77 9.63 14.58 9.66 14.39C9.7 14.2 9.76 14.02 9.83 13.84C9.9 13.66 10 13.5 10.1 13.34C10.21 13.18 10.33 13.03 10.47 12.89C10.6 12.76 10.75 12.63 10.91 12.53C11.07 12.42 11.24 12.33 11.42 12.26C11.6 12.18 11.78 12.13 11.97 12.09C12.16 12.05 12.35 12.03 12.55 12.03L15.28 12.03C15.42 12.03 15.56 12.02 15.69 11.99C15.82 11.97 15.96 11.93 16.08 11.87C16.21 11.82 16.33 11.76 16.44 11.68C16.56 11.61 16.66 11.52 16.76 11.42C16.85 11.33 16.94 11.22 17.02 11.11C17.09 11 17.16 10.88 17.21 10.75C17.26 10.62 17.3 10.5 17.33 10.36C17.35 10.23 17.37 10.09 17.37 9.96C17.37 9.38 17.28 8.83 17.11 8.28C16.94 7.74 16.69 7.23 16.36 6.76L14.73 4.44C14.53 4.16 14.3 3.91 14.04 3.69C13.79 3.46 13.51 3.27 13.2 3.11C12.9 2.96 12.58 2.84 12.25 2.76C11.92 2.68 11.58 2.63 11.24 2.63L8.4 2.64Z" fill="currentColor" fill-opacity="1.000000" fill-rule="nonzero"></path></g></svg>
                        {rejecting ? 'Rejecting...' : 'Reject'}
                      </Button>
                    </>
                  )}
                 
                </>
              )}
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewRequest;