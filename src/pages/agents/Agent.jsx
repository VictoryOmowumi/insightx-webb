import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getAgentById, resetAgentPassword } from "@/services/api";
import { Toaster, toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BreadCrumbs from "@/components/layout/BreadCrumb";
import { Skeleton } from "@/components/ui/skeleton";
import moment from "moment";
const Agent = () => {
  const { id } = useParams();
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const agentData = await getAgentById(id);
        setAgent(agentData);
        setLoading(false);
      } catch (error) {
        setError(error);
        toast.error("Failed to fetch agent details: " + error.message);
        setLoading(false);
      }
    };

    fetchAgent();
  }, [id]);

  const handleResetPassword = async () => {
    try {
      await resetAgentPassword(id, { newPassword });
      toast.success("Password reset successfully!");
      setNewPassword("");
    } catch (error) {
      toast.error("Failed to reset password: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <Skeleton className="h-8 w-1/4 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-4" />
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-4 w-3/4 mb-2" />
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error.message}</div>;
  }

  if (!agent) {
    return <div className="p-4">Agent not found.</div>;
  }

  return (
    <div className="flex flex-col gap-4 mt-5 md:mx-1">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-5xl capitalize">Agent Details</h1>
          <BreadCrumbs />
        </div>
      </div>

      <div className="bg-card p-6 rounded-lg ">
        <h2 className="text-2xl font-medium mb-4">Agent Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label>Name</Label>
            <p className="text-lg">{agent.name}</p>
          </div>
          <div>
            <Label>Email</Label>
            <p className="text-lg">{agent.email || '-'}</p>
          </div>
          <div>
            <Label>Phone</Label>
            <p className="text-lg">{agent.phone}</p>
          </div>
          <div>
            <Label>Address</Label>
            <p className="text-lg">{agent.address}</p>
          </div>
          <div>
            <Label>Created At</Label>
            <p className="text-lg">{new Date(agent.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <Label>Updated At</Label>
            <p className="text-lg">{new Date(agent.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="bg-card p-6 rounded-lg ">
        <h2 className="text-2xl font-medium mb-4">Assigned Activities</h2>
        {agent.activities && agent.activities.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="w-full text-left font-medium text-neutral-800 dark:text-gray-200 bg-white dark:bg-gray-300/20 ">
                  <th className="py-4 uppercase  text-xs px-4 ">Activity Name</th>
                  <th className="py-4 uppercase  text-xs px-4">Start Date</th>
                  <th className="py-4 uppercase  text-xs px-4">End Date</th>
                  <th className="py-4 uppercase  text-xs px-4">Status</th>
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
                      <td className="py-5 px-4"><Skeleton className="h-4 w-1/4" /></td>
                    </tr>
                  ))
                ) : (
                  agent?.activities.map((activity, index) => (
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
                      <td className="py-5  px-4">
                        <Link to={`/activities/${activity._id}`} className="text-blue-500 hover:underline">View</Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-lg">No activities assigned.</p>
        )}
      </div>

      <div className="bg-card p-6 rounded-lg ">
        <h2 className="text-2xl font-medium mb-4">Reset Password</h2>
        <div className="space-y-4">
          <div>
            <Label>New Password</Label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>
          <Button onClick={handleResetPassword}>Reset Password</Button>
        </div>
      </div>

      <Toaster richColors />
    </div>
  );
};

export default Agent;