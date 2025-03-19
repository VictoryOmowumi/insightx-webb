import React from 'react';
import { Activity, List, CheckCircle, Calendar, PauseCircle } from 'lucide-react';
import {motion} from 'framer-motion';

const ActivitySummaryCard = () => {
  const kpis = [
    { label: 'Total Activities', value: 50, icon: <Activity strokeWidth={1.5} size={24} /> },
    { label: 'Active Activities', value: 12, icon: <List strokeWidth={1.5} size={24} /> },
    { label: 'Completed Activities', value: 30, icon: <CheckCircle strokeWidth={1.5} size={24} /> },
    { label: 'Upcoming Activities', value: 8, icon: <Calendar strokeWidth={1.5} size={24} /> },
    { label: 'Paused Activities', value: 0, icon: <PauseCircle strokeWidth={1.5} size={24} /> },
  ];

  return (
    <div className="grid md:grid-cols-3 grid-cols-2 lg:grid-cols-5 gap-1">
      {kpis.map((kpi, index) => (
        <div
          key={index}
          className="flex flex-col gap-4 p-6 w-full h-full rounded-[40px] bg-[#fcfbfcfb] dark:bg-zinc-800 "
        >
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-medium text-zinc-700 dark:text-zinc-200">
              {kpi.label}
            </h1>
            <motion.div className='w-12 h-12 py-3 flex bg-[#fcfbfcac] dark:bg-zinc-800 rounded-full justify-center items-center' whileHover={{ scale: 1.1 }} transition={{ type: 'spring', stiffness: 300 }}>
              {kpi.icon}
            </motion.div>
          </div>
          <p className="text-3xl font-bmedium text-zinc-800 dark:text-zinc-100">
            {kpi.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ActivitySummaryCard;