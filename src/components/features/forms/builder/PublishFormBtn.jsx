import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MdOutlinePublish } from "react-icons/md";
import useDesigner from "@/hooks/useDesigner";
import { toast } from "sonner";
import Confetti from "react-confetti";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { publishForm, getActivities, getAgents, getCollaborators, updateForm } from "@/services/api"; // Your API utility functions
import { useParams } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import MultiSelect from "@/components/common/MultiSelect";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const PublishFormBtn = () => {
  const { elements } = useDesigner();
  const [isPublishing, setIsPublishing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showUrlDialog, setShowUrlDialog] = useState(false);
  const [formUrl, setFormUrl] = useState("");
  const [visibility, setVisibility] = useState(false); // Default visibility is false (public)
  const [selectedActivity, setSelectedActivity] = useState("");
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [selectedCollaborators, setSelectedCollaborators] = useState([]);
  const [activities, setActivities] = useState([]);
  const [agents, setAgents] = useState([]);
  const [collaborators, setCollaborators] = useState([]);
  const { id: formId } = useParams(); // Get formId from URL params

  useEffect(() => {
    const fetchData = async () => {
      try {
        const activitiesData = await getActivities();
        const agentsData = await getAgents();
        const collaboratorsData = await getCollaborators();

        // Transform agents and collaborators data
        const transformedAgents = agentsData.map(agent => ({
          value: agent._id,
          name: agent.name,
        }));

        const transformedCollaborators = collaboratorsData.map(collaborator => ({
          value: collaborator._id,
          name: collaborator.name,
        }));

        setActivities(activitiesData?.activities);
        setAgents(transformedAgents);
        setCollaborators(transformedCollaborators);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data.");
      }
    };

    fetchData();
  }, []);

  const handlePublish = async () => {
    setIsPublishing(true);

    try {
      if (elements.length === 0) {
        toast.error("Your form is empty. Please add elements before publishing.");
        return;
      }

      if (visibility && (!selectedActivity || selectedAgents.length === 0)) {
        toast.error("Please select an activity and at least one agent for restricted visibility.");
        return;
      }

      // Prepare payload
      const payload = {
        elements,
        visibility: visibility ? "restricted" : "public",
        activity: selectedActivity,
        agents: visibility ? selectedAgents : '',
        collaborators: selectedCollaborators,
      };

      // Publish the form
      const response = await publishForm(formId, payload);
      setFormUrl(response.url);
      setShowConfetti(true);
      setShowUrlDialog(true);

      toast.success("Form published successfully!");
    } catch (error) {
      console.error("Error publishing form:", error);
      toast.error("Failed to publish the form.");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleUpdateForm = async () => {
    if (visibility && (!selectedActivity || selectedAgents.length === 0)) {
      toast.error("Please select an activity and at least one agent for restricted visibility.");
      return;
    }
    setSaving(true);

    // Prepare payload
    const payload = {
      elements,
      visibility: visibility ? "restricted" : "public",
      activity: selectedActivity,
      assignedAgents: visibility ? selectedAgents : '',
      collaborators: selectedCollaborators,
    };

    try {
      await updateForm(formId, payload);
      toast.success("Form Updated successfully");
      setShowUrlDialog(false);
    }
    catch (error) {
      console.error("Error updating form:", error);
      toast.error("Failed to update the form.");
    }
    finally {
      setSaving(false);
    }

  };

  const handleCopyUrl = () => {
    toast.success("URL copied to clipboard!");
  };

 

  return (
    <>
      {showConfetti && (
        <div className="fixed inset-0 z-[1000] pointer-events-none">
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={500}
            onConfettiComplete={() => setShowConfetti(false)}
          />
        </div>
      )}

      {/* Publish Confirmation Dialog */}
      <AlertDialog>
        <AlertDialogTrigger className="bg-[#FCF8E5] dark:bg-neutral-800 hover:!bg-neutral-900 text-foreground hover:text-white shadow-none rounded-4xl flex items-center p-2">
          <MdOutlinePublish className=" mr-2" />
          Publish
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Publish Form</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to publish this form?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePublish} disabled={isPublishing}>
              {isPublishing ? "Publishing..." : "Publish"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* URL Dialog */}
      <Dialog open={showUrlDialog} onOpenChange={setShowUrlDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Form Published Successfully!</DialogTitle>
            <DialogDescription>
              Your form is now live. Here's the URL:
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={formUrl}
              readOnly
              className="flex-1 p-2 border rounded"
            />
            <CopyToClipboard text={formUrl} onCopy={handleCopyUrl}>
              <Button>Copy URL</Button>
            </CopyToClipboard>
          </div>

          {/* Visibility Toggle */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <label className="font-medium">Visibility:</label>
              <Switch
                checked={visibility}
                onCheckedChange={(checked) => setVisibility(checked)}
              />
            </div>

            {/* Activity Combo Box (Visible only for restricted visibility) */}
            {visibility && (
              <div>
                <Label htmlFor="activity">Assign Activity</Label>
                <Select
                  value={selectedActivity}
                  onValueChange={(value) => setSelectedActivity(value)}
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
            )}

            {/* Agents Multi-Select (Visible only for restricted visibility) */}
            {visibility && (
              <div className="flex flex-col gap-1">
                <label className="font-medium text-sm text-foreground ">Assign Agents</label>
                <MultiSelect
                  options={agents}
                  onValueChange={(value) => setSelectedAgents(value)}
                  value={selectedAgents}
                  placeholder="Select agents"
                  // chipProps={{ variant: "outlined" }}
                />
              </div>
            )}

            {/* Collaborators Multi-Select */}
            <div className="flex flex-col gap-1">
              <label className="font-medium text-sm text-foreground ">Add Collaborators</label>
              <MultiSelect
                options={collaborators}
                onValueChange={(value) => setSelectedCollaborators(value)}
                value={selectedCollaborators}
                placeholder="Select collaborators"
                // chipProps={{ variant: "outlined" }}
              />
            </div>

            {visibility && (
              <Button 
                onClick={handleUpdateForm}
                variant="default" type="submit" className="w-full">
                Submit
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PublishFormBtn;