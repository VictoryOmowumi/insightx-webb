import React, { useState, useEffect } from 'react';
import BreadCrumbs from '../../components/layout/BreadCrumb';
import { Link } from 'react-router-dom';
import { CircleFadingPlus, List, Grid } from 'lucide-react';
import SummaryCards from '@/components/features/forms/SummaryCards';
import NewFormButton from '@/components/features/forms/NewFormButton';
import { getForms } from '@/services/api';
import FormCards from '@/components/features/forms/FormCards';
import FormsTable from '@/components/features/forms/FormsTable';
import Loader from '@/components/common/Loader';

const FormsDashboard = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState(localStorage.getItem('view') || 'cards');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await getForms();
        setForms(response);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchForms();
  }, [user.id]);

  const handleViewChange = (view) => {
    setView(view);
    localStorage.setItem('view', view);
  };


  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className='flex flex-col gap-4 overflow-clip'>
      <div className="flex flex-wrap justify-between gap-4 md:gap-0 items-center mt-2 md:mx-5">
        <div className="flex flex-col">
          <h1 className="text-3xl md:text-5xl capitalize">Form Management</h1>
          <BreadCrumbs />
        </div>
        <div className="flex items-center gap-1">
         <NewFormButton />
          <button
            onClick={() => handleViewChange('cards')}
            className='bg-[#303030] dark:bg-neutral-700 cursor-pointer flex items-center gap-2 font-comfortaa text-white p-3 rounded-full hover:bg-[#202020]'
          >
            {view === 'cards' ? (
              <Grid size={16} strokeWidth={2} />
            ) : (
              <List size={16} strokeWidth={2} />
            )}
          </button>
        </div>
      </div>
      <SummaryCards />
      {
        view === 'cards' ? (
            <FormCards forms={forms} loading={loading} />
        ) : (
          <FormsTable forms={forms} loading={loading} />
        )
      }

    </div>
  );
};

export default FormsDashboard;