import { useForm, Controller } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Toast } from "../../ui/toast";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { FilePlus, Loader } from "lucide-react";
import { createForm } from "@/services/api";
// Define the schema
const formSchema = yup.object({
  title: yup.string().min(3, "Form name must be at least 3 characters").required("Form name is required"),
  description: yup.string().min(3, "Form description must be at least 3 characters"),
});

const NewFormButton = () => {
  const { handleSubmit, control, formState } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const formResponse = await createForm(data);
      const formId = formResponse.id;
      toast.success('Form created successfully');
      navigate(`/forms/form-builder/${formId}`);
    } catch (error) {
      console.error('Error creating form:', error);
      toast.error('Failed to create form');
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="bg-[#303030] dark:bg-neutral-700 cursor-pointer flex items-center gap-2 font-comfortaa text-white px-4 py-2.5 rounded-full hover:bg-[#202020]">
          <FilePlus size={16} strokeWidth={1} />
          New Form
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Form</DialogTitle>
          <DialogDescription>
            Create a new form to collect data from your users.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-5">
          {/* Form Name */}
          <div>
            <label
              className="block text-xs text-gray-700 dark:text-gray-300 font-medium"
              htmlFor="title"
            >
              Title
            </label>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  id="title"
                  type="text"
                  placeholder="Enter form name"
                  className="w-full px-4 py-2.5 border rounded-lg placeholder:gray-400 placeholder:text-xs dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:placeholder-gray-300"
                />
              )}
            />
            {formState.errors.name && (
              <p className="text-xs font-comfortaa text-red-500">
                {formState.errors.name.message}
              </p>
            )}
          </div>

          {/* Form Description */}
          <div>
            <label
              className="block text-xs text-gray-700 dark:text-gray-300 font-medium"
              htmlFor="description"
            >
              Description
            </label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  id="description"
                  placeholder="Enter form description"
                  className="w-full px-4 py-2.5 border rounded-lg placeholder:gray-400 placeholder:text-xs  dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:placeholder-gray-300"
                />
              )}
            />
          </div>

          <DialogFooter>
            <button
              type="submit"
              className=" w-full flex items-center justify-center gap-2 px-4 py-2 bg-neutral-800 text-white rounded-lg"
            >
           {formState.isSubmitting ? <Loader size={20} strokeWidth={2} /> : 'Create Form'}
            </button>
          </DialogFooter>
        </form>

        <Toast />
      </DialogContent>
    </Dialog>
  );
};

export default NewFormButton;
