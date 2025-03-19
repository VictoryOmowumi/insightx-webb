import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast, Toaster } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FilePlus, Loader, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { createStockRequest } from '@/services/api';
// Form validation schema
const schema = yup.object().shape({
  request_title: yup.string().required('Request title is required'),
  description: yup.string().required('Description is required'),
  items: yup
    .array()
    .of(
      yup.object().shape({
        item_name: yup.string().required('Item name is required'),
        quantity: yup
          .number()
          .typeError('Quantity must be a number')
          .required('Quantity is required')
          .min(1, 'Quantity must be at least 1'),
        purpose: yup.string().required('Purpose is required'),
      })
    )
    .min(1, 'At least one item is required'),
});

const AddRequest = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      requested_by: user?.name || '',
      request_title: '',
      description: '',
      items: [{ item_name: '', quantity: '', purpose: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Construct the payload
      const payload = {
        requested_by: user?.name || '', // Use the user's name from localStorage
        request_title: data.request_title,
        description: data.description,
        items: data.items.map((item) => ({
          item_name: item.item_name,
          quantity: Number(item.quantity), // Ensure quantity is a number
          purpose: item.purpose,
        })),
      };
  
      // Log the payload for debugging
      console.log('Submitting payload:', payload);
  
      // Submit the request
      const response = await createStockRequest(payload);
  
      // Show success message
      toast.success('Request submitted successfully');
      setIsDialogOpen(false);
      reset();
    } catch (error) {
      // Log the error for debugging
      console.error('Error submitting request:', error);
  
      // Show error message
      toast.error('Failed to submit request');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <button variant="default" className="bg-[#303030] dark:bg-neutral-700 flex items-center gap-1.5 font-comfortaa text-white px-4 py-2.5 rounded-full hover:bg-[#202020]">
          <FilePlus size={16} />
          Add Request
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] overflow-y-scroll h-[90vh]">
        <DialogHeader>
          <DialogTitle>Create New Stock Request</DialogTitle>
          <DialogDescription>
            Fill out the form to request new stock items.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium mb-1">Request Title</label>
            <Input
              {...register('request_title')}
              placeholder="Enter request title"
              className="w-full"
            />
            {errors.request_title && (
              <p className="text-sm text-red-500">{errors.request_title.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Input
              {...register('description')}
              placeholder="Enter request description"
              className="w-full"
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>
          <div className="space-y-4">
            {fields.map((field, index) => (
              <Card key={field.id} className="space-y-2 bg-transparent shadow-none">
                <CardHeader className="flex flex-row justify-between items-center">
                  <h4 className="text-sm font-medium">Item {index + 1}</h4>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Item Name
                    </label>
                    <Input
                      {...register(`items.${index}.item_name`)}
                      placeholder="Enter item name"
                      className="w-full"
                    />
                    {errors.items?.[index]?.item_name && (
                      <p className="text-sm text-red-500">
                        {errors.items[index].item_name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Quantity
                    </label>
                    <Input
                      {...register(`items.${index}.quantity`)}
                      placeholder="Enter quantity"
                      className="w-full"
                      type="number"
                    />
                    {errors.items?.[index]?.quantity && (
                      <p className="text-sm text-red-500">
                        {errors.items[index].quantity.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Purpose
                    </label>
                    <Input
                      {...register(`items.${index}.purpose`)}
                      placeholder="Enter purpose"
                      className="w-full"
                    />
                    {errors.items?.[index]?.purpose && (
                      <p className="text-sm text-red-500">
                        {errors.items[index].purpose.message}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => append({ item_name: '', quantity: '', purpose: '' })}
              className="w-full"
            >
              Add Item
            </Button>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader className="animate-spin" size={16} />
              ) : (
                'Submit Request'
              )}
            </Button>
          </DialogFooter>
        </form>
       
      </DialogContent>

    </Dialog>
  );
};

export default AddRequest;