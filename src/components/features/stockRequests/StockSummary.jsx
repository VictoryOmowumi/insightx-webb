import React, {useState, useEffect} from 'react';
import { Activity, List, CheckCircle, Calendar, BadgeDollarSign } from 'lucide-react';
import {motion} from 'framer-motion';
import { stockRequestSummary} from '@/services/api';
import { Skeleton } from "../../ui/skeleton";
const StockSummary = () => {
    const [kpis, setKpis] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSummaryData = async () => {
          try {
            const response = await stockRequestSummary();
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


  return (
    <div className="flex-1 flex items-center justify-end md:pr-2 gap-2 md:gap-8">
         {loading
           ? Array.from({ length: 4 }).map((_, index) => (
               <div key={index} className="flex flex-col gap-[1px]">
                 <div className="flex gap-1">
                   <div className="flex mt-5 items-center justify-center w-6 h-6 rounded-full bg-[#B6B6B6]/20">
                     <Skeleton className="h-6 w-6" />
                   </div>
                   <Skeleton className="h-10 w-20 mt-2" />
                 </div>
                 <Skeleton className="h-4 w-16 mt-2" />
               </div>
             ))
           : kpis.map((kpi, index) => (
               <div key={index} className="flex flex-col gap-[1px]">
                 <div className="flex gap-1">
                   <div className="flex mt-5 items-center justify-center w-6 h-6 rounded-full bg-[#B6B6B6]/20">
                     {kpi.label === "Total Requests" && <Activity size={10} strokeWidth={1} />}
                     {kpi.label === "Pending Requests" && <List size={12} strokeWidth={1} />}
                     {kpi.label === "Approved Requests" && <CheckCircle size={12} strokeWidth={1} />}
                     {kpi.label === "Rejected Requests" && <Calendar size={12} strokeWidth={1} />}
                     {kpi.label === "Modified Requests" && <BadgeDollarSign size={12} strokeWidth={1} />}
                   </div>
                   <h2 className="text-3xl md:text-5xl text-[#303030] dark:text-[#f5f5f5]">
                     {kpi.value === "NaN" ? 0 : kpi.value}
                   </h2>
                 </div>
                 <h3 className="text-[12px] ml-2">{kpi.label}</h3>
               </div>
             ))}
       </div>
  )
}

export default StockSummary

