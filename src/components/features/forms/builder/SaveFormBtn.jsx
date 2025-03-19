import { Button } from "@/components/ui/button";
import { HiSaveAs } from "react-icons/hi";
import useDesigner from "@/hooks/useDesigner";
import { Toaster, toast,  } from "sonner";
import { updateForm } from "@/services/api";
import { useParams } from "react-router-dom";
const SaveFormBtn = () => {
  const { elements } = useDesigner();
  const { id } = useParams();
  
 

  const saveFormContent = async () => {
    try {
      await updateForm(id, { elements });
      toast.success("Form saved successfully");
    } catch (error) {
      console.error("Error saving form:", error);
      toast.error("Failed to save the form.");
    }
  };





  return (
    <>
    <Button
      // variant={"outline"}
      onClick={saveFormContent}
      className="bg-[#FCF8E5] dark:bg-neutral-800 dark:hover:bg-neutral-900 text-foreground hover:text-white shadow-none rounded-4xl"
    >
      <HiSaveAs className="w-6 h-6" />
      Save
    </Button>
    <Toaster richColors />
    </>
  );
};

export default SaveFormBtn;
