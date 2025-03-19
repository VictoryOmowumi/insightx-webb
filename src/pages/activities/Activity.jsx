import React, { useState, useEffect } from 'react';
import BreadCrumbs from '../../components/layout/BreadCrumb';
import { Link, useParams } from 'react-router-dom';
import ActivityDetails from '../../components/features/activities/ActivityDetails';
import Tab from '../../components/features/activities/Tab';
import ActivityForm from '../../components/features/activities/ActivityForm';
import ActivityFeedback from '../../components/features/activities/ActivityFeedback';
import ActivityChat from '../../components/features/activities/ActivityChat';
import { CheckCheckIcon, Edit, Pause, XCircle, Play } from 'lucide-react';
import { getStatusClasses } from '../../utils/format';
import { getActivityById, updateActivity } from '@/services/api';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
const tabs = [
  { id: 1, name: 'Details' },
  { id: 2, name: 'Activity Form' },
  { id: 3, name: 'Feedback' },
];

const loader = (
  <svg
    className="w-5 h-5 mr-2 animate-spin"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

const Activity = () => {
  const { id } = useParams();
  const [activity, setActivity] = useState({});
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await getActivityById(id);
        setActivity(response);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching activity:', error);
        setLoading(false);
        setError(error);
      }
    };
    fetchActivity();
  }, [id]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handleUpdateStatus = async (status) => {
    setUpdatingStatus(true);
    try {
      const data = { status };
      const response = await updateActivity(activity._id, data);
      setActivity(response);
      setUpdatingStatus(false);
      toast.success('Status updated successfully');
    } catch (error) {
      setUpdatingStatus(false);
      setError(error);
      toast.error(`Error updating status: ${error.response.data.message}`);
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className="flex flex-col gap-4 ">
      {
        loading ? (
          <div className="flex  flex-wrap justify-between items-end mt-2 md:mx-5">
            <div className="flex flex-col gap-2">
              <Skeleton height={40} width={200} />
              <BreadCrumbs />
            </div>
            <div className="flex flex-wrap items-center gap-2">
            </div>
          </div>
        ) : (

          <div className="flex  flex-wrap justify-between items-end mt-2 md:mx-5">
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl capitalize flex items-center">
                {activity.title}
                <span
                  className={`text-sm p-1.5 rounded-xl  ml-2 ${getStatusClasses(
                    activity.status
                  )}`}
                >
                  {' '}
                  {activity.status}
                </span>
              </h1>
              <BreadCrumbs />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {activity.status !== 'Completed' && activity.status !== 'Cancelled' && (
                <>
                  <div className="flex items-center gap-1">
                    <Link
                      to={`/activities/edit/${activity._id}`}
                      className="border border-neutral-800 dark:border-neutral-300 px-4 py-2.5 rounded-xl text-neutral-800 dark:text-neutral-300 flex items-center gap-2 hover:bg-neutral-800 hover:text-gray-200 transition-colors duration-300"
                    >
                      <span className="">Edit Activity</span>
                      <Edit size={16} strokeWidth={1} />
                    </Link>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleUpdateStatus('Completed')}
                      className="bg-neutral-800 dark:bg-neutral-700 px-4 py-2.5 rounded-xl text-gray-200 flex items-center gap-2 hover:bg-neutral-900 transition-colors duration-300"
                    >
                      <span className="">Mark As Complete</span>
                      {updatingStatus ? loader : <CheckCheckIcon size={20} strokeWidth={1} />}
                    </button>
                  </div>
                  {activity.status === 'Paused' ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleUpdateStatus('In Progress')}
                        className="bg-green-500 px-4 py-2.5 rounded-xl text-gray-200 flex items-center gap-2 hover:bg-green-600 transition-colors duration-300"
                      >
                        <span className="">Resume Activity</span>
                        {updatingStatus ? loader : <Play size={20} strokeWidth={1} />}
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleUpdateStatus('Paused')}
                        className="bg-yellow-500 px-4 py-2.5 rounded-xl text-gray-200 flex items-center gap-2 hover:bg-yellow-600 transition-colors duration-300"
                      >
                        <span className="">Pause Activity</span>
                        {updatingStatus ? loader : <Pause size={20} strokeWidth={1} />}
                      </button>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleUpdateStatus('Cancelled')}
                      className="bg-red-500 px-4 py-2.5 rounded-xl text-gray-200 flex items-center gap-2 hover:bg-red-600 transition-colors duration-300"
                    >
                      <span className="">Cancel Activity</span>
                      {updatingStatus ? loader : <XCircle size={20} strokeWidth={1} />}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )
      }

      {/* Main Grid Layout */}
      <div className="grid md:grid-cols-3 gap-1 h-full pb-8">
        <div className="md:col-span-2 max-h-[80vh] overflow-scroll h-full no-scrollbar rounded-[20px] bg-white dark:bg-neutral-800 flex flex-col gap-2">
          <Tab tabs={tabs} activeTab={activeTab} handleTabChange={handleTabChange} />
          {activeTab === 1 && <ActivityDetails activity={activity} loading={loading} />}
          {activeTab === 2 && <ActivityForm activity={activity} />}
          {activeTab === 3 && <ActivityFeedback activity={activity} />}
        </div>
        <div className="md:col-span-1 max-h-[80vh] rounded-[20px] overflow-clip bg-white dark:bg-neutral-800 relative">
          <ActivityChat activity={activity} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default Activity;