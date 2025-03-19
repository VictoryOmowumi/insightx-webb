import React, { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { getActivities } from '@/services/api';
import { Link } from 'react-router-dom';
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import moment from 'moment';

const ActivitiesTable = ({ filters }) => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                const activitiesData = await getActivities();
                setActivities(activitiesData?.activities);
                setLoading(false);
            } catch (error) {
                toast.error('Failed to fetch data: ' + error.message);
                setError(error);
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredActivities = activities.filter((activity) => {
        const matchesStatus = filters.status === "All" || activity.status === filters.status;
        const matchesDateRange =
            (!filters.dateRange.start || new Date(activity.startDate) >= new Date(filters.dateRange.start)) &&
            (!filters.dateRange.end || new Date(activity.endDate) <= new Date(filters.dateRange.end));
        const matchesSearchQuery = activity.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesDateRange && matchesSearchQuery;
    });

    if (error) {
        return <div className="col-span-2 text-center text-red-500">Failed to fetch data: {error.message}</div>;
    };

    return (
        <div className="col-span-2 flex flex-col gap-5 mt-1 bg-card dark:bg-[#161616] py-3 rounded-[40px]">
            <div className="flex flex-wrap gap-4 md:gap-0 justify-between items-center px-4 pb-3">
                <h2 className="text-2xl ">Ongoing Activities</h2>
                <div className='flex items-center gap-1'>
                    {/* search bar */}
                    <input type="text" placeholder="Search . . ." value={searchQuery} onChange={handleSearchChange} className="bg-[#ffffff] dark:bg-zinc-800 rounded-full h-12  px-4 py-3 w-60 focus:outline-none" />
                    <button className="flex w-12 min-h-12 h-full  bg-[#ffffff] dark:bg-zinc-800 rounded-full justify-center items-center hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer">
                        <ArrowUpRight size={20} strokeWidth={1} />
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                    <thead>
                        <tr className="w-full text-left font-medium text-neutral-800 dark:text-gray-200 bg-white dark:bg-gray-300/20 ">
                            <th className="py-4 uppercase  text-xs px-4 ">Activity Name</th>
                            <th className="py-4 uppercase  text-xs px-4">Start Date</th>
                            <th className="py-4 uppercase  text-xs px-4">End Date</th>
                            <th className="py-4 uppercase  text-xs px-4">Status</th>
                            <th className="py-4 uppercase  text-xs px-4">Created Date</th>
                            <th className="py-4 uppercase  text-xs px-4 ">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, index) => (
                                <tr key={index} className="hover:bg-gray-100/35 text-sm space-y-6 dark:hover:bg-gray-800">
                                    <td className="py-5 px-4"><Skeleton className="h-4 w-3/4" /></td>
                                    <td className="py-5 px-4"><Skeleton className="h-4 w-1/2" /></td>
                                    <td className="py-5 px-4"><Skeleton className="h-4 w-1/2" /></td>
                                    <td className="py-5 px-4"><Skeleton className="h-4 w-1/4" /></td>
                                    <td className="py-5 px-4"><Skeleton className="h-4 w-1/2" /></td>
                                    <td className="py-5 px-4"><Skeleton className="h-4 w-1/4" /></td>
                                </tr>
                            ))
                        ) : (
                            filteredActivities.slice(0, 5).map((activity, index) => (
                                <tr
                                    key={index}
                                    className="hover:bg-gray-100/35 text-sm space-y-6 dark:hover:bg-neutral-800/50"
                                >
                                    <td className="py-5  px-4">{activity.title}</td>
                                    <td className="py-5  px-4">{moment(activity.startDate).format('MMMM Do YYYY')}</td>
                                    <td className="py-5  px-4">{moment(activity.endDate).format('MMMM Do YYYY')}</td>
                                    <td
                                        className={`py-5 px-4 ${activity.status === "Completed"
                                            ? "text-green-500"
                                            : activity.status === "In Progress"
                                                ? "text-yellow-500"
                                                : "text-red-500"
                                            }`}
                                    >
                                        {activity.status}
                                    </td>
                                    <td className="py-5  px-4">{moment(activity.createdAt).format('MMMM Do YYYY')}</td>
                                    <td className="py-5  px-4">
                                        <Link to={`/activities/${activity._id}`} className="text-blue-500 hover:underline">View</Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ActivitiesTable;