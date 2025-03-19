import { useDndMonitor, useDroppable } from "@dnd-kit/core";
import DesignerSidebar from "./DesignerSidebar";
import { cn } from "@/lib/utils";
import useDesigner from "@/hooks/useDesigner";
import FormElements from "./FormElements";
import { idGenerator } from "@/lib/idGenerator";
import { useDraggable } from "@dnd-kit/core";
import { Button } from "@/components/ui/button";
import { BiSolidTrash } from "react-icons/bi";
import { useState } from "react";
import blankCanva from "@/assets/blank-canva.svg";

const Designer = () => {
  const { elements, removeElement, addElement, selectedElement, setSelectedElement } = useDesigner();
 
  const droppable = useDroppable({
    id: "designer-drop-area",
    data: {
      isDesignerDropArea: true,
    },
  });

  useDndMonitor({
    onDragEnd: (event) => {
      const { active, over } = event;
      if (!active || !over) return;

      const isDesignerBtnElement = active.data.current?.isDesignerBtnElement;
      const isDroppingOverDesignerDropArea = over.data.current?.isDesignerDropArea;

      // first scenario: dropping a sidebar button over the designer drop area
      if (isDesignerBtnElement && isDroppingOverDesignerDropArea) {
        const type = active.data.current?.type;
        const newElement = FormElements[type].construct(idGenerator());
        addElement(elements.length, newElement);
        return;
      }

      const isDroppingOverDesignerElementTopHalf = over.data.current?.isTopHalfDesignerElement;
      const isDroppingOverDesignerElementBottomHalf = over.data.current?.isBottomHalfDesignerElement;
      const isDroppingOverDesignerElement = isDroppingOverDesignerElementTopHalf || isDroppingOverDesignerElementBottomHalf;
      const droppingSidebarBtnOverDesignerElement = isDesignerBtnElement && isDroppingOverDesignerElement;

      // second scenario: dropping a sidebar button over a designer element
      if (droppingSidebarBtnOverDesignerElement) {
        const type = active.data?.current?.type;
        const newElement = FormElements[type].construct(idGenerator());
        const overId = over.data.current?.elementId;
        const overElementIndex = elements.findIndex((el) => el.id === overId);
        if (overElementIndex === -1) {
          throw new Error("Element not found");
        }
        let indexForNewElement = overElementIndex;
        if (isDroppingOverDesignerElementBottomHalf) {
          indexForNewElement = overElementIndex + 1;
        }
        addElement(indexForNewElement, newElement);
        return;
      }

      // third scenario: reordering elements
      const isDraggingDesignerElement = active.data.current?.isDesignerElement;
      const draggingDesignerElementOverAnotherDesignerElement = isDroppingOverDesignerElement && isDraggingDesignerElement;
      if (draggingDesignerElementOverAnotherDesignerElement) {
        const activeId = active.data.current?.elementId;
        const overId = over.data.current?.elementId;
        const activeElementIndex = elements.findIndex((el) => el.id === activeId);
        const overElementIndex = elements.findIndex((el) => el.id === overId);
        if (activeElementIndex === -1 || overElementIndex === -1) {
          throw new Error("Element not found");
        }
        const activeElement = { ...elements[activeElementIndex] };
        removeElement(activeId);
        let indexForNewElement = overElementIndex;
        if (isDroppingOverDesignerElementBottomHalf) {
          indexForNewElement = overElementIndex + 1;
        }
        addElement(indexForNewElement, activeElement);
      }
    },
  });

  return (
    <div className="flex w-full gap-4 editor-bg">
      <div
        className="w-full h-full flex-[3]"
        onClick={() => {
          if (selectedElement) {
            setSelectedElement(null);
          }
        }}
      >
        <div
          ref={droppable.setNodeRef}
          className={cn(
            "bg-[#f5f5f5]  dark:bg-neutral-900 m-2 min-w-[920px] h-full rounded-xl flex flex-col flex-grow w-full justify-start overflow-y-auto",
            droppable.isOver && "border-2 border-dashed border-primary-green"
          )}
        >
          {!droppable.isOver && elements.length === 0 && (
            <div className="flex flex-col justify-center gap-2 items-center h-full">
              <img src={blankCanva} alt="blank canvas" className="w-[200px] h-[200px]" />
              <p className="text-xl text-center text-muted-foreground font-comfortaa font-medium">
                Drag and drop elements here
              </p>
            </div>
          )}
          {droppable.isOver && elements.length === 0 && (
            <div className="p-4 w-full">
              <div className="h-[120px] rounded bg-accent"></div>
            </div>
          )}
          {elements.length > 0 && (
            <div className="flex flex-col gap-2 p-2 mb-5">
              {elements.map((element) => {
                return <DesignerElementWrapper key={element.id} element={element} />;
              })}
            </div>
          )}
        </div>
      </div>
      <DesignerSidebar />
    </div>
  );
};

const DesignerElementWrapper = ({ element }) => {
  const DesignerElement = FormElements[element.type].designerComponent;
  const { removeElement, setSelectedElement } = useDesigner();
  const [mouseIsOver, setMouseIsOver] = useState(false);

  const topHalf = useDroppable({
    id: `${element.id}-top`,
    data: {
      type: element.type,
      elementId: element.id,
      isTopHalfDesignerElement: true,
    },
  });

  const bottomHalf = useDroppable({
    id: `${element.id}-bottom`,
    data: {
      type: element.type,
      elementId: element.id,
      isBottomHalfDesignerElement: true,
    },
  });

  const draggable = useDraggable({
    id: `${element.id}-drag-handler`,
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
      {...draggable.listeners}
      {...draggable.attributes}
      className="bg-white dark:bg-neutral-800 relative min-h-[120px] flex flex-col text-foreground hover:cursor-pointer rounded-md ring-1 ring-accent ring-inset"
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedElement(element);
      }}
    >
      {/* Drag handle */}
      <div
        className={cn(
          "z-[999] absolute top-0 left-0 w-full h-[120px] bg-gray-300 rounded cursor-move",
          draggable.isDragging ? "opacity-80" : "opacity-0"
        )}
      ></div>
      <div ref={topHalf.setNodeRef} className="absolute w-full h-1/2 rounded-t-md" />
      <div ref={bottomHalf.setNodeRef} className="absolute w-full bottom-0 h-1/2 rounded-b-md" />

      {mouseIsOver && (
        <>
          <div className="z-[999] absolute right-0 h-full">
            <Button
              variant={"outline"}
              className="z-50 text-white flex justify-center h-full rounded-md rounded-l-none bg-red-500"
              onClick={(e) => {
                e.stopPropagation();
                removeElement(element.id);
              }}
            >
              <BiSolidTrash />
            </Button>
          </div>
          <div className="z-20 bg-off-white-300 dark:bg-off-white-600 rounded-md text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full flex justify-center items-center animate-pulse">
            <p className="text-muted-foreground text-sm">Click for properties or drag to move</p>
          </div>
        </>
      )}
      {topHalf.isOver && <div className="absolute top-0 w-full h-[7px] rounded-md bg-primary rounded-b-none" />}

      <div
        className={cn(
          "z-10 opacity-100 flex w-full h-[120px] items-center rounded-md bg-accent/40, px-4 py-2 pointer-events-none",
          mouseIsOver && "opacity-30"
        )}
      >
        <DesignerElement elementInstance={element} />
      </div>
      {bottomHalf.isOver && <div className="absolute w-full bottom-0 h-[7px] bg-primary rounded-md rounded-t-none" />}
    </div>
  );
};

export default Designer;