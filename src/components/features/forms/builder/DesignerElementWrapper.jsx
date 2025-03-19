import { useState } from "react";
import { FormElements } from "./FormElements";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { Button } from "@/components/ui/button";
import { BiSolidTrash } from "react-icons/bi";
import { cn } from "@/lib/utils";
import useDesigner from "@/hooks/useDesigner";

const DesignerElementWrapper = ({ element }) => {
  const DesignerElement = FormElements[element.type].designerComponent;
  const { removeElement } = useDesigner();
  const [mouseIsOver, setMouseIsOver] = useState(false);

  const topHalf = useDroppable({
    id: element.id + "-top",
    data: {
      type: element.type,
      elementId: element.id,
      isTopHalfDesignerElement: true,
    },
  });

  const bottomHalf = useDroppable({
    id: element.id + "-bottom",
    data: {
      type: element.type,
      elementId: element.id,
      isBottomHalfDesignerElement: true,
    },
  });

  const draggable = useDraggable({
    id: element.id + "-drag-handler",
    data: {
      type: element.type,
      elementId: element.id,
      isDesignerElement: true,
    },
  });

  if (draggable.isDragging) return null;

  return (
    <div
      ref={draggable.setNodeRef}
      {...draggable.attributes}
      {...draggable.listeners}
      className="relative h-[120px] flex flex-col text-foreground hover:cursor-pointer rounded-md ring-1 ring-accent ring-inset"
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
    >
      <div
        ref={topHalf.setNodeRef}
        className="absolute w-full h-1/2 rounded-t-md"
      ></div>
      <div
        ref={bottomHalf.setNodeRef}
        className="absolute w-full bottom-0 h-1/2 rounded-b-md"
      ></div>

      {mouseIsOver && (
        <>
          <div className="z-[999] absolute right-0 h-full hover:bg-blue-700">
            <Button
              variant={"outline"}
              className="z-50 text-white flex justify-center h-full rounded-md rounded-l-none bg-red-500 hover:border-2"
              onClick={() => {
                console.log("Button clicked!"); // Add this to confirm the button works
                removeElement(element.id);
                console.log("removeElement called with ID:", element.id); // Log the `id`
              }}
            >
              <BiSolidTrash />
            </Button>
          </div>
          <div className="z-20 bg-black dark:bg-off-white-600 rounded-md text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full flex justify-center items-center animate-pulse">
            <p className="text-muted-foreground text-sm">
              Click for properties or drag to move
            </p>
          </div>
        </>
      )}
      <div
        className={cn(
          "z-10 opacity-100 flex w-full min-h-[120px] items-center rounded-md bg-accent/40 dark:bg-neutral-800 px-4 py-2 pointer-events-none",
          mouseIsOver ? "opacity-30" : "",
          topHalf.isOver ? "border-t-4 border-t-foreground" : "",
          bottomHalf.isOver ? "border-b-4 border-b-foreground" : ""
        )}
      >
        <DesignerElement elementInstance={element} />
      </div>
    </div>
  );
};

export default DesignerElementWrapper;