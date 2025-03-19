import React, { useState, useEffect } from 'react';
import { Activity, List, CheckCircle, Calendar, PauseCircle, BadgeDollarSign } from 'lucide-react';
import { activitiesSummary } from '@/services/api';
import { Skeleton } from "../../ui/skeleton";

const SummaryCards = () => {
  const [kpis, setKpis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        const response = await activitiesSummary();
        setKpis(response);
        setLoading(false);
      }
      catch (error) {
        console.error('Error fetching summary data:', error);
        setLoading(false);
        setError(error);
      }
    }
    fetchSummaryData();
  }, []);
  const selectedIndices = [0, 1, 2, 3, 5, 6];

  const filteredData = kpis.filter((_, index) => selectedIndices.includes(index));


  return (
    <div className="flex-1 flex items-center justify-end md:pr-2 gap-2 md:gap-8">

      {loading
        ? Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex flex-col gap-[1px]">
            <div className="flex gap-1">
              <div className="flex mt-5 items-center justify-center w-6 h-6 rounded-full bg-[#B6B6B6]/20">
                <Skeleton className="h-6 w-6" />
              </div>
              <Skeleton className="h-10 w-20 mt-2" />
            </div>
            <Skeleton className="h-4 w-16 mt-2" />
          </div>
        )) : filteredData.map((kpi, index) => (
          <div key={index} className="flex flex-col gap-[1px]">
            <div className="flex gap-1">
              <div className="flex mt-5 items-center justify-center w-6 h-6 rounded-full bg-[#B6B6B6]/20">

                {kpi.label === 'Total Activities' && <List size={10} strokeWidth={1} />}
                {kpi.label === 'Average Budget' && <BadgeDollarSign size={10} strokeWidth={1} />}
                {kpi.label === 'Total Budget' && <BadgeDollarSign size={10} strokeWidth={1} />}
                {kpi.label === 'Active Activities' && <Activity size={10} strokeWidth={1} />}
                {kpi.label === 'Completed Activities' && <CheckCircle size={10} strokeWidth={1} />}
                {kpi.label === 'Pending Activities' && <PauseCircle size={10} strokeWidth={1} />}
                {kpi.label === 'Overdue Activities' && <Calendar size={10} strokeWidth={1} />}

              </div>
              <h2 className="text-3xl font-light md:text-5xl text-[#303030] dark:text-[#f5f5f5]">
                {kpi.value === "NaN" ? 0 : kpi.value}
              </h2>
            </div>
            <h3 className="text-[12px] ml-2">{kpi.label}</h3>
          </div>
        ))}


    </div>
  );
};

export default SummaryCards;