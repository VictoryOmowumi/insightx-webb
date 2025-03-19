import FormElements from './FormElements';
import { Button } from "@/components/ui/button";
import { useDraggable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

const SidebarBtnElement = ({ formElement }) => {
  const { label, icon: Icon } = formElement.designerBtnElement;
  const draggable = useDraggable({
    id: `designer-btn-${formElement.type}`,
    data: {
      type: formElement.type,
      isDesignerBtnElement: true,
    },
  });

  return (
    <Button
      ref={draggable.setNodeRef}
      {...draggable.attributes}
      {...draggable.listeners}
      variant={"outline"}
      className={cn(
        "flex flex-col dark:bg-neutral-800 items-center gap-1 h-[120px] w-[120px] cursor-grab",
        draggable.isDragging ? "ring-1 ring-amber-500" : ""
      )}
    >
      <Icon className="w-8 h-8 cursor-grab" />
      <p className="text-xs">{label}</p>
    </Button>
  );
};

export const SidebarBtnElementDragOverlay = ({ formElement }) => {

  if (!formElement || !formElement.designerBtnElement) {
    return null; 
  }

  const { label, icon: Icon } = formElement.designerBtnElement;

  const draggable = useDraggable({
    id: `designer-btn-${formElement.type}`,
    data: {
      type: formElement.type,
      isDesignerBtnElement: true,
    },
  });

  return (
    <Button
      ref={draggable.setNodeRef}
      {...draggable.attributes}
      {...draggable.listeners}
      variant={"outline"}
      className={cn(
        "flex bg-accent flex-col items-center gap-1 h-[150px] w-[150px] cursor-grab",
        draggable.isDragging ? "ring-1 ring-blue-500" : ""
      )}
    >
      <Icon className="w-8 h-8 cursor-grab text-amber-500" />
      <p className="text-xs">{label}</p>
    </Button>
  );
};

export default SidebarBtnElement;