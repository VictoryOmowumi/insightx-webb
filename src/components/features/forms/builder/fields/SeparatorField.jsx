import { Label } from "@/components/ui/label";
import { LucideSeparatorHorizontal } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const type = "SeparatorField";
const extraAttributes = {};
export const SeparatorFieldFormElement = {
  type,
  construct: (id) => ({
    id,
    type,
    extraAttributes
  }),
  designerBtnElement: {
    icon: LucideSeparatorHorizontal,
    label: "Separator Field",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
};

function DesignerComponent() {
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label>Separator Field</Label>
      <Separator />
    </div>
  );
}

function PropertiesComponent() {
  return <p>No properties for this element</p>;
}

function FormComponent() {
  return <Separator />;
}