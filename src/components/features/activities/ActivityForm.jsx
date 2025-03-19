import React, {useState, useEffect} from 'react';
import { formatDate } from '../../../utils/format';
import { getAgents } from '@/services/api';
import blank from '@/assets/blank-canva.svg';
const ActivityForm = ({ activity }) => {

    const form = activity?.form;
   
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const response = await getAgents();
                setAgents(response);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching agents:', error);
                setLoading(false);
                setError(error);
            }
        };
        fetchAgents();
    }, []);




    const totalAssignedAgents = form?.assignedAgents?.length || 0;
    const totalSubmissions = form?.responses?.length || 0;
    const submissionRate = totalAssignedAgents > 0 ? ((totalSubmissions / totalAssignedAgents) * 100).toFixed(2) + '%' : '0%';

    if(activity?.form === undefined) {
        return (
            <div className="flex flex-col gap-4 items-center justify-center h-96">
                <img src={blank} alt="No form assigned" className="w-56 h-auto" />
                <p className="text-lg text-neutral-500 dark:text-neutral-400">No form Assigned for this activity.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 mx-5 my-2">
            <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                    <h1 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Title</h1>
                    <p className="text-lg text-neutral-700 dark:text-neutral-200">{form?.title}</p>
                </div>
                <div className="flex flex-col gap-2">
                    <h1 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Description</h1>
                    <p className="text-lg text-neutral-700 dark:text-neutral-200">{form?.description}</p>
                </div>
                <div className="flex flex-col gap-2">
                    <h1 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Form URL</h1>
                    <a href={`/forms/${form?.slug}`} className="w-max text-lg text-blue-500 dark:text-blue-300" target="_blank" rel="noopener noreferrer">
                       Click here to view form
                    </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
                        <h2 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Total Assigned Agents</h2>
                        <p className="text-2xl font-medium text-neutral-700 dark:text-neutral-200">{totalAssignedAgents}</p>
                    </div>
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
                        <h2 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Total Submissions</h2>
                        <p className="text-2xl font-medium text-neutral-700 dark:text-neutral-200">{totalSubmissions}</p>
                    </div>
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
                        <h2 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Submission Rate</h2>
                        <p className="text-2xl font-medium text-neutral-700 dark:text-neutral-200">{submissionRate}</p>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <h1 className="text-lg font-medium text-neutral-500 dark:text-neutral-400">Assigned Agents</h1>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Phone</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total Submissions</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Last Submission</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                {/* {form?.assignedAgents?.map((agentId) => {
                                    const agent = agents.find((a) => a._id === agentId);
                                    return (
                                        <tr key={agent._id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">{agent.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{agent.phone}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{agent.totalSubmissions}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{formatDate(agent.lastSubmission)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                <button className="text-blue-500 dark:text-blue-300">View</button>
                                            </td>
                                        </tr>
                                    );
                                })} */}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivityForm;