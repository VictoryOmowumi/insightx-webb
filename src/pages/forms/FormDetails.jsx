import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFormById } from '@/services/api';
import BreadCrumbs from '@/components/layout/BreadCrumb';
import { Calendar, FileText, EyeOff, Edit, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Assuming you're using shadcn/ui
import { Skeleton } from '@/components/ui/skeleton'; // Skeleton component from shadcn/ui

const FormDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchForm = async () => {
    try {
      const response = await getFormById(id);
      setForm(response);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForm();
  }, [id]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    fetchForm();
  };

  const handleEditForm = () => {
    navigate(`/forms/form-builder/${id}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap justify-between gap-4 md:gap-0 items-center mt-2 md:mx-5">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-8 w-48" /> 
            <Skeleton className="h-4 w-64" /> 
          </div>
        </div>

        <div className="md:mx-5 bg-white dark:bg-gray-800 p-6 rounded-[20px] shadow-sm">
          <Skeleton className="h-6 w-32 mb-4" /> 
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map((_, index) => (
              <Skeleton key={index} className="h-20 w-full" /> 
            ))}
          </div>

          <Skeleton className="h-6 w-32 mb-4" /> 
          <Skeleton className="h-4 w-full mb-2" /> 
          <Skeleton className="h-4 w-3/4" /> 

          <Skeleton className="h-6 w-32 mb-4" /> 
          {[1, 2, 3].map((_, index) => (
            <Skeleton key={index} className="h-20 w-full mb-4" /> 
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4 justify-center items-center h-screen">
        <p className="text-red-500 text-lg mb-4">Error: {error.message}</p>
        <Button onClick={handleRetry} className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header Section */}
      <div className="flex flex-wrap justify-between gap-4 md:gap-0 items-center mt-2 md:mx-5">
        <div className="flex flex-col">
          <h1 className="text-3xl md:text-5xl capitalize">{form.title}
            <span className={`ml-2 text-sm py-1.5 px-2.5 rounded-3xl ${form.status === 'published' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
              {form.status}
            </span>
          </h1>
          <BreadCrumbs />
        </div>
        <Button onClick={handleEditForm} className="flex items-center gap-2 bg-[#FCF8E5] text-foreground hover:text-white shadow-none rounded-4xl">
          <Edit className="w-4 h-4" />
          Edit Form
        </Button>
      </div>

      {/* Form Details Section */}
      <div className="md:mx-5 bg-[#F7F6F2] dark:bg-gray-800 p-6 rounded-[20px] shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Form Details</h2>

        {/* Form Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center gap-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <FileText className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
              <p className="font-medium">{form.status}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <EyeOff className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Visibility</p>
              <p className="font-medium">{form.visibility}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Published At</p>
              <p className="font-medium">
                {new Date(form.publishedAt?.$date?.$numberLong).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Form Description */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <p className="text-gray-600 dark:text-gray-300">{form.description}</p>
        </div>

        {/* Form Elements */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-2">Form Elements</h3>
          {form.elements?.map((element, index) => (
            <div key={element._id?.$oid} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              {element.type === 'TitleField' && (
                <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {element.extraAttributes?.title}
                </h4>
              )}

              {element.type === 'SubTitleField' && (
                <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {element.extraAttributes?.subtitle}
                </h5>
              )}

              {element.type === 'TextField' && (
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {element.extraAttributes?.label}
                  </label>
                  <input
                    type="text"
                    placeholder={element.extraAttributes?.placeholder}
                    className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg w-full"
                    disabled
                  />
                  {element.extraAttributes?.helperText && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {element.extraAttributes?.helperText}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Responses Section */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Responses</h3>
          {form.responses?.length > 0 ? (
            <div className="space-y-4">
              {form.responses.map((response, index) => (
                <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Response #{index + 1}
                  </p>
                  {/* Display response data here */}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-300">No responses yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormDetails;