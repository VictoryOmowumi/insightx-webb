import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const StatusChart = ({ data, loading }) => {
    const statuses = [
        {
            name: 'Completed',
            value: data?.activityMetrics?.completedActivities || 0,
            color: 'bg-[#303030]',
            textColor: 'text-white',
        },
        {
            name: 'Active',
            value: data?.activityMetrics?.activeActivities || 0,
            color: 'bg-amber-400/80',
            textColor: 'text-white',
        },
        {
            name: 'Pending',
            value: data?.activityMetrics?.pendingActivities || 0,
            color: 'bg-striped',
            textColor: '',
        },
        {
            name: 'Upcoming',
            value: data?.activityMetrics?.upcomingActivities || 0,
            color: 'border border-[#303030]',
            textColor: '',
        },
    ];

    const totalActivities = statuses.reduce((acc, status) => acc + status.value, 0);
    const calculateWidth = (value) => {
        const width = (value / totalActivities) * 100;
        return width > 0 ? `${width}%` : '20%'; // Set a minimum width of 5%
    };

    return (
        <div className='flex items-center gap-[2px] rounded-full'>
            {loading ? (
                <Skeleton className="h-12 w-full rounded-full" />
            ) : (
                statuses.map((status, index) => (
                    <div key={index} className="flex flex-col gap-1" style={{ width: calculateWidth(status.value) }}>
                        <h3 className='text-sm font-semibold ml-5'>{status.name}</h3>
                        <div className={`h-12 flex items-center rounded-full ${status.color} w-full`}>
                            <span className={`${status.textColor} ml-5`}>
                                {status.value}
                            </span>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default StatusChart;