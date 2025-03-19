import React, { useState, useEffect } from 'react';
import BreadCrumbs from '../../components/layout/BreadCrumb';
import { useForm, Controller } from 'react-hook-form';
import { toast, Toaster } from 'sonner';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import MultiSelect from '@/components/common/MultiSelect';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import { createActivity, updateActivity, getChannels } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus } from 'lucide-react';

const AddActivity = ({ initialData, mode = 'create' }) => {
  const [saving, setSaving] = useState(false);
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const channelsData = await getChannels();
        const transformedChannels = channelsData.map((channel) => ({
          value: channel._id,
          name: channel.name,
        }));
        setChannels(transformedChannels);
      } catch (error) {
        toast.error('Failed to fetch channels: ' + error.message);
      }
    };
    fetchData();
  }, []);

  const schema = yup.object().shape({
    title: yup.string().required('Title is required'),
    description: yup.string(),
    status: yup.string().oneOf(['Pending', 'In Progress', 'Paused', 'Completed']).required('Status is required'),
    startDate: yup.date().required('Start date is required'),
    endDate: yup.date().required('End date is required'),
    targetAudience: yup.string().required('Target audience is required'),
    location: yup.string(),
    budget: yup.number().positive('Budget must be a positive number'),
    channels: yup.array().of(yup.string()),
    type: yup.string().oneOf(['Campaign', 'Event', 'Product Activation']).required('Type is required'),
    kpis: yup.array().of(
      yup.object().shape({
        name: yup.string().required('KPI name is required'),
        target: yup.number().required('KPI target is required'),
      })
    ),
    progress: yup.number().min(0).max(100),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialData || {
      channels: [],
      kpis: [],
    },
  });

  const watchChannels = watch('channels', []);
  const watchKpis = watch('kpis', []);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      if (mode === 'edit') {
        await updateActivity(initialData._id, data); // Update activity
        toast.success('Activity updated successfully');
      } else {
        await createActivity(data); // Create activity
        toast.success('Activity created successfully');
      }
      reset();
    } catch (error) {
      toast.error(`Failed to ${mode === 'edit' ? 'update' : 'create'} activity: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const addKpi = () => {
    setValue('kpis', [...watchKpis, { name: '', target: 0 }]);
  };

  const removeKpi = (index) => {
    const updatedKpis = watchKpis.filter((_, i) => i !== index);
    setValue('kpis', updatedKpis);
  };

  return (
    <div className="flex flex-col gap-4 mt-5">
      <div className="flex flex-col md:mx-5">
        <h1 className="text-4xl capitalize">{mode === 'edit' ? 'Edit Activity' : 'Create New Activity'}</h1>
        <BreadCrumbs />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="md:mx-5">
        <div className='bg-white/50 dark:bg-neutral-800/50 p-5 rounded-lg '>
          <h2 className='font-medium text-xl'>Activity Details</h2>
          <hr className="my-3" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
            {/* Activity Type Field */}
            <div className="flex flex-col">
              <Label htmlFor="type">Activity Type</Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select {...field} onValueChange={field.onChange} value={field.value} >
                    <SelectTrigger>
                      <SelectValue placeholder="Select activity type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Campaign">Campaign</SelectItem>
                      <SelectItem value="Event">Event</SelectItem>
                      <SelectItem value="Product Activation">Product Activation</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <p className="text-red-500 text-sm">{errors.type?.message}</p>
            </div>

            {/* Title Field */}
            <div className="flex flex-col">
              <Label htmlFor="title">Activity Title</Label>
              <Controller
                name="title"
                control={control}
                render={({ field }) => <Input {...field} placeholder="Enter form title" />}
              />
              <p className="text-red-500 text-sm">{errors.title?.message}</p>
            </div>

            {/* Description Field */}
            <div className="flex flex-col">
              <Label htmlFor="description">Description</Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => <Textarea {...field} placeholder="Enter form description" />}
              />
              <p className="text-red-500 text-sm">{errors.description?.message}</p>
            </div>

            {/* Status Field */}
            <div className="flex flex-col">
              <Label htmlFor="status">Status</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select {...field} onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Paused">Paused</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <p className="text-red-500 text-sm">{errors.status?.message}</p>
            </div>

            {/* Start Date Field */}
            <div className="flex flex-col">
              <Label htmlFor="startDate">Start Date</Label>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => <Input {...field} type="date" />}
              />
              <p className="text-red-500 text-sm">{errors.startDate?.message}</p>
            </div>

            {/* End Date Field */}
            <div className="flex flex-col">
              <Label htmlFor="endDate">End Date</Label>
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => <Input {...field} type="date" />}
              />
              <p className="text-red-500 text-sm">{errors.endDate?.message}</p>
            </div>

            {/* Target Audience Field */}
            <div className="flex flex-col">
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Controller
                name="targetAudience"
                control={control}
                render={({ field }) => (
                  <Select {...field} onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select target audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Teenagers">Teenagers</SelectItem>
                      <SelectItem value="Young Adults">Young Adults</SelectItem>
                      <SelectItem value="Adults">Adults</SelectItem>
                      <SelectItem value="Seniors">Seniors</SelectItem>
                      <SelectItem value="All">All</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <p className="text-red-500 text-sm">{errors.targetAudience?.message}</p>
            </div>

            {/* Location Field */}
            <div className="flex flex-col">
              <Label htmlFor="location">Location</Label>
              <Controller
                name="location"
                control={control}
                render={({ field }) => <Input {...field} placeholder="Enter location" />}
              />
              <p className="text-red-500 text-sm">{errors.location?.message}</p>
            </div>

            {/* Budget Field */}
            <div className="flex flex-col">
              <Label htmlFor="budget">Budget</Label>
              <Controller
                name="budget"
                control={control}
                render={({ field }) => <Input {...field} type="number" placeholder="Enter budget" />}
              />
              <p className="text-red-500 text-sm">{errors.budget?.message}</p>
            </div>

            {/* Channels Field */}
            <div className="flex flex-col">
              <Label htmlFor="channels">Channels</Label>
              <Controller
                name="channels"
                control={control}
                render={({ field }) => (
                  <MultiSelect
                    {...field}
                    options={channels}
                    onValueChange={(value) => setValue('channels', value)}
                    defaultValue={watchChannels}
                    placeholder="Select channels"
                  />
                )}
              />
              <p className="text-red-500 text-sm">{errors.channels?.message}</p>
            </div>

            {/* KPIs Field */}
            <div className="flex flex-col">
              <Card className="shadow-none bg-white/70 dark:bg-neutral-800 border-none">
                <CardHeader>
                  <CardTitle>KPIs</CardTitle>
                </CardHeader>
                <CardContent>
                  {watchKpis.map((kpi, index) => (
                    <div key={index} className="grid grid-cols-3 gap-4 mb-4">
                      {/* KPI Name Input */}
                      <div className="flex flex-col">
                        <Label htmlFor={`kpis[${index}].name`}>KPI Name</Label>
                        <Controller
                          name={`kpis[${index}].name`}
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              placeholder="Enter KPI name"
                              className="w-full"
                            />
                          )}
                        />
                        {errors.kpis?.[index]?.name && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.kpis[index].name.message}
                          </p>
                        )}
                      </div>

                      {/* KPI Target Input */}
                      <div className="flex flex-col">
                        <Label htmlFor={`kpis[${index}].target`}>Target</Label>
                        <Controller
                          name={`kpis[${index}].target`}
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              type="number"
                              placeholder="Enter target"
                              className="w-full"
                            />
                          )}
                        />
                        {errors.kpis?.[index]?.target && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.kpis[index].target.message}
                          </p>
                        )}
                      </div>

                      {/* Remove Button */}
                      <div className="flex items-end">
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => removeKpi(index)}
                          className="flex items-center gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {/* Add KPI Button */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addKpi}
                    className="mt-4 flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add KPI
                  </Button>

                  {/* General KPI Error */}
                  {errors.kpis && (
                    <p className="text-red-500 text-sm mt-2">{errors.kpis.message}</p>
                  )}
                </CardContent>
              </Card>
            </div>
            {/* Submit Button */}
          </div>
          <div className="flex w-full justify-end">
            <Button type="submit" className="mt-4 bg-blue-500 text-white px-5 h-12 !py-3 rounded-[10px] hover:bg-opacity-80 transition">
              {saving ? (mode === 'edit' ? 'Updating...' : 'Creating...') : (mode === 'edit' ? 'Update Activity' : 'Create Activity')}
            </Button>
          </div>
        </div>
      </form>
      <Toaster richColors />
    </div>
  );
};

export default AddActivity;