import React from 'react';
import { formatDate, formatCurrency } from '../../../utils/format';
import { Skeleton } from '@/components/ui/skeleton';

const ActivityDetails = ({ activity, loading }) => {
  if (loading) {
    return (
      <div className="flex flex-col gap-4 mx-5 my-2">
        <div className="flex flex-col gap-5">
          {/* Description Skeleton */}
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-full" />
          </div>

          {/* Goal Skeleton */}
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-full" />
          </div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-3 gap-5">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="flex flex-col gap-1">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>

          {/* KPIs Skeleton */}
          <div className="flex flex-col gap-2 mb-4">
            <Skeleton className="h-6 w-24" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, index) => (
                <Skeleton key={index} className="h-20 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 mx-5 my-2">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <h1 className="text-lg font-medium text-neutral-500 dark:text-neutral-400">
            Description
          </h1>
          <p className="text-lg text-neutral-700 dark:text-neutral-200">
            {activity.description}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-lg font-medium text-neutral-500 dark:text-neutral-400">Goal</h1>
          <p className="text-lg text-neutral-700 dark:text-neutral-200">
            {activity.goals}
          </p>
        </div>
        <div className="grid grid-cols-3 flex-wrap gap-5">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
              Start Date
            </p>
            <p className=" text-neutral-700 dark:text-neutral-200">
              {formatDate(activity.startDate)}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
              End Date
            </p>
            <p className=" text-neutral-700 dark:text-neutral-200">
              {formatDate(activity.endDate)}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
              Target Audience
            </p>
            <p className="text-nowrap text-neutral-700 dark:text-neutral-200">
              {activity.targetAudience}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
              Budget
            </p>
            <p className="text-nowrap text-neutral-700 dark:text-neutral-200">
              {formatCurrency(activity.budget)}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
              Location
            </p>
            <p className="text-nowrap text-neutral-700 dark:text-neutral-200">
              {activity.location || '-'}
            </p>
          </div>
        </div>
        {/* KPI cards */}
        <div className="flex flex-col gap-2 mb-4">
          <h1 className="text-lg font-medium text-neutral-500 dark:text-neutral-400">
            KPIs
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {activity?.kpis?.map((kpi) => (
              <div key={kpi._id} className="flex flex-col gap-1 p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  {kpi.name}
                </p>
                <p className="text-lg text-neutral-700 dark:text-neutral-200">
                  {kpi.target}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetails;