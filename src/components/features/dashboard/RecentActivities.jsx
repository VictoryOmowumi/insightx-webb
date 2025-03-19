import React from 'react';
import { PiClockCountdownFill } from 'react-icons/pi';
import { RiShoppingCart2Fill, RiFileTextFill } from 'react-icons/ri';
import { BiCommentDetail } from 'react-icons/bi';
import { PiPackageLight } from "react-icons/pi";
import { Skeleton } from '@/components/ui/skeleton';
import moment from 'moment';

const RecentActivities = ({ recentActivities, loading }) => {
  return (
    <div className="flex flex-col gap-5 mt-1 bg-card2 dark:bg-[#161616] p-6 rounded-[40px] h-[510px] overflow-clip overflow-y-auto no-scrollbar">
      <h2 className="text-2xl text-gray-900 dark:text-gray-100 mb-2">Recent Activities</h2>
      <div className="space-y-8 relative">
        {/* Timeline line */}
        <div className="absolute left-5 top-0 h-full w-0.5 bg-gray-200 dark:bg-gray-700"></div>

        {loading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-start gap-4 relative">
              {/* Icon container */}
              <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-gray-300 dark:bg-gray-700 relative z-10">
                <Skeleton className="h-6 w-6 rounded-full" />
              </div>

              {/* Content */}
              <div className="flex-1 bg-[#ffffff] dark:bg-neutral-800 p-4 rounded-lg shadow shadow-amber-50 dark:shadow-neutral-800 border border-gray-100 dark:border-neutral-800">
                <div className="flex justify-between items-center mb-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/6" />
                </div>
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))
        ) : (
          recentActivities.slice(0, 5)?.map((activity) => (
            <div key={activity._id} className="flex items-start gap-4 relative">
              {/* Icon container */}
              <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-blue-500 text-white dark:bg-blue-600 relative z-10">
                {activity.icon === "PiClockCountdownFill" && <PiClockCountdownFill size={20} />}
                {activity.icon === "RiShoppingCart2Fill" && <PiPackageLight size={20} />}
                {activity.icon === "BiCommentDetail" && <BiCommentDetail size={20} />}
                {activity.icon === "RiFileTextFill" && <RiFileTextFill size={20} />}
                
              </div>

              {/* Content */}
              <div className="flex-1 bg-[#ffffff] dark:bg-neutral-800 p-4 rounded-lg shadow shadow-amber-50 dark:shadow-neutral-800 border border-gray-100 dark:border-neutral-800">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {activity.type}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {moment(activity.date).fromNow()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-200">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  By {activity.user}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentActivities;