import React, { useState, useEffect } from "react";
import {
  Activity,
  List,
  CheckCircle,
  Calendar,
} from "lucide-react";
import { Skeleton } from "../../ui/skeleton";
import { formSummary } from "@/services/api";

const SummaryCards = () => {
  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState([]);

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        const response = await formSummary();
        setSummaryData(response);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching summary data:", error);
        setLoading(false);
      }
    };

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
        : summaryData.map((kpi, index) => (
            <div key={index} className="flex flex-col gap-[1px]">
              <div className="flex gap-1">
                <div className="flex mt-5 items-center justify-center w-6 h-6 rounded-full bg-[#B6B6B6]/20">
                  {kpi.label === "Total Forms" && <Activity size={10} strokeWidth={1} />}
                  {kpi.label === "Active Forms" && <List size={12} strokeWidth={1} />}
                  {kpi.label === "Completed Forms" && <CheckCircle size={12} strokeWidth={1} />}
                  {kpi.label === "Submission Rate" && <Calendar size={12} strokeWidth={1} />}
                </div>
                <h2 className="text-3xl md:text-5xl text-[#303030] dark:text-[#f5f5f5]">
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