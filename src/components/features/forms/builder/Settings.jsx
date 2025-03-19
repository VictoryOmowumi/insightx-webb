import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { updateForm } from '@/services/api';
import { Toaster, toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getActivities } from '@/services/api'; // Fetch activities
import { getAgents  } from '@/services/api'; // Fetch agents

const Settings = ({ form }) => {
  
  const [title, setTitle] = useState(form?.title || '');
  const [description, setDescription] = useState(form?.description || '');
  const [visibility, setVisibility] = useState(form?.visibility || 'restricted');
  const [acceptResponses, setAcceptResponses] = useState(form?.acceptResponses || true);
  const [activity, setActivity] = useState(form?.activity || '');
  const [assignedAgents, setAssignedAgents] = useState(form?.assignedAgents || []);
  const [activities, setActivities] = useState([]); // List of activities
  const [agents, setAgents] = useState([]); // List of agents
  const [isSaving, setIsSaving] = useState(false);

  // Fetch activities and agents on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const activitiesData = await getActivities();
        const agentsData = await getAgents();
        setActivities(activitiesData.activities);
        setAgents(agentsData);
      } catch (error) {
        toast.error('Failed to fetch data: ' + error.message);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const data = {
        title,
        description,
        visibility,
        acceptResponses,
        activity,
        assignedAgents,
      };
      const id = form._id;
      await updateForm(id, data);
      toast.success('Settings saved successfully!');
      window.location.reload();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error('Failed to update settings: ' + errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 md:max-w-3xl w-full">
      <h2 className="text-xl font-semibold mb-4">Settings</h2>
      <div className="space-y-4">
        {/* Form Title */}
        <div>
          <Label htmlFor="title">Form Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter form title"
          />
        </div>

        {/* Form Description */}
        <div>
          <Label htmlFor="description">Form Description</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter form description"
          />
        </div>

        {/* Visibility */}
        <div>
          <Label htmlFor="visibility">Visibility</Label>
          <Select value={visibility} onValueChange={(value) => setVisibility(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="restricted">Restricted</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Assign Activity */}
        <div>
          <Label htmlFor="activity">Assign Activity</Label>
          <Select
            value={activity}
            onValueChange={(value) => setActivity(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an activity" />
            </SelectTrigger>
            <SelectContent>
              {activities.map((activity) => (
                <SelectItem key={activity._id} value={activity._id}>
                  {activity.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Assign Agents */}
        <div>
          <Label htmlFor="agents">Assign Agents</Label>
          <Select
            multiple
            value={assignedAgents}
            onValueChange={(values) => setAssignedAgents(values)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select agents" />
            </SelectTrigger>
            <SelectContent>
              {agents.map((agent) => (
                <SelectItem key={agent._id} value={agent._id}>
                  {agent.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Accept Responses */}
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div>
            <Label htmlFor="acceptResponses">Accept Responses</Label>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Allow users to submit responses to this form.
            </p>
          </div>
          <Switch
            id="acceptResponses"
            checked={acceptResponses}
            onCheckedChange={(checked) => setAcceptResponses(checked)}
          />
        </div>

        {/* Save Button */}
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
      <Toaster richColors />
    </div>
  );
};

export default Settings;