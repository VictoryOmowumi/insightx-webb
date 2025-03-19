import React, { useState, useEffect } from 'react'
import Greeting from '../../components/features/dashboard/Greeting'
import StatusChart from '../../components/features/dashboard/StatusChart'
import { Activity, List, CircleDotDashed, Box } from 'lucide-react';
import ActivitiesTable from '../../components/features/dashboard/ActivitiesTable';
import Filter from '../../components/features/dashboard/Filter';
import RecentActivities from '../../components/features/dashboard/RecentActivities';
import { dashboardSummary } from '@/services/api';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';


const Dashboard = () => {
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: "All",
    dateRange: { start: "", end: "" },
  });

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const summaryData = await dashboardSummary();
        setSummary(summaryData);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to fetch data: ' + error.message);
        setError(error);
      }
    }
    fetchData();
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };
  return (
    <div className='flex flex-col gap-4 mt-5'>
      <div className="flex flex-wrap gap-4 md:gap-0 justify-between items-center">
        <Greeting />
        <Filter filters={filters} handleFilterChange={handleFilterChange} />
      </div>
      <div className="flex flex-wrap justify-between items-center gap-5 w-full">
        <div className="flex-1">
          <StatusChart loading={loading} data={summary} />

        </div>
        <div className="flex-1 flex items-center justify-end md:pr-2 gap-2 md:gap-8">
          {
            loading ? Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex flex-col gap-[1px]">
                <div className="flex gap-1">
                  <div className="flex mt-5 items-center justify-center w-6 h-6 rounded-full bg-[#B6B6B6]/20">
                    <Skeleton className="h-6 w-6" />
                  </div>
                  <Skeleton className="h-10 w-20 mt-2" />
                </div>
                <Skeleton className="h-4 w-16 mt-2" />
              </div>
            )) : <>

              <div className="flex flex-col gap-[1px]">
                <div className="flex  gap-1 ">
                  <div className="flex mt-5 items-center justify-center w-6 h-6 rounded-full bg-[#B6B6B6]/20">
                    <Activity size={10} strokeWidth={1} className="" />
                  </div>
                  <h2 className='text-3xl md:text-5xl   text-[#303030] dark:text-[#f5f5f5]'>{summary?.activityMetrics?.totalActivities}</h2>
                </div>
                <h3 className='text-[12px] ml-2 '>Activities</h3>
              </div>
              <div className="flex flex-col gap-[1px]">
                <div className="flex  gap-1">
                  <div className="flex mt-5 items-center justify-center w-6 h-6 rounded-full bg-[#B6B6B6]/20">
                    <List size={12} strokeWidth={1} className="" />
                  </div>
                  <h2 className='text-3xl md:text-5xl  text-[#303030] dark:text-[#f5f5f5]'>{summary?.formMetrics?.submittedForms}</h2>
                </div>
                <h3 className='text-[12px] ml-2'>Form Submissions</h3>
              </div>
              <div className="flex flex-col gap-[1px]">
                <div className="flex  gap-1">
                  <div className="flex mt-5 items-center justify-center w-6 h-6 rounded-full bg-[#B6B6B6]/20">
                    <CircleDotDashed size={12} strokeWidth={1} className="" />
                  </div>
                  <h2 className='text-3xl md:text-5xl  text-[#303030] dark:text-[#f5f5f5]'>{summary?.requestMetrics?.pendingRequests}</h2>
                </div>
                <h3 className='text-[12px] ml-2'>Pending Requests</h3>
              </div>
              <div className="flex flex-col gap-[1px]">
                <div className="flex  gap-1">
                  <div className="flex mt-5 items-center justify-center w-6 h-6 rounded-full bg-[#B6B6B6]/20">
                    <Box size={12} strokeWidth={1} className="" />
                  </div>
                  <h2 className='text-3xl md:text-5xl  text-[#303030] dark:text-[#f5f5f5]'>{summary?.requestMetrics?.totalRequests}</h2>
                </div>
                <h3 className='text-[12px] ml-2'>Stock Requests</h3>
              </div>
            </>
          }
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
        <ActivitiesTable filters={filters} handleFilterChange={handleFilterChange} />
        <div className="col-span-1">
          <RecentActivities recentActivities={summary?.recentActivities} loading={loading} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard