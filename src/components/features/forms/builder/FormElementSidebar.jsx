import SidebarBtnElement from "./SidebarBtnElement";
import FormElements from "./FormElements";
import { Separator } from "@/components/ui/separator";
const FormElementSidebar = () => {
  return (
    <div className="rounded-4xl">
      <p className="text-sm text-foreground">Drag and drop elements</p>
      <Separator className="my-2" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-5 gap-x-8 place-items-center">
        <p className="text-sm text-muted-foreground col-span-1 md:col-span-3 my-2 place-self-start">
          Layout Elements
        </p>
        <SidebarBtnElement formElement={FormElements.TitleField} />
        <SidebarBtnElement formElement={FormElements.SubTitleField} />
        <SidebarBtnElement formElement={FormElements.ParagraphField} />
        <SidebarBtnElement formElement={FormElements.SeparatorField} />
        <SidebarBtnElement formElement={FormElements.SpacerField} />
        <p className="text-sm text-muted-foreground col-span-1 md:col-span-3 my-2 place-self-start">
          Form Elements
        </p>
        <SidebarBtnElement formElement={FormElements.TextField} />
        <SidebarBtnElement formElement={FormElements.NumberField} />
        <SidebarBtnElement formElement={FormElements.TextAreaField} />
        <SidebarBtnElement formElement={FormElements.DateField} />
        <SidebarBtnElement formElement={FormElements.SelectField} />
        <SidebarBtnElement formElement={FormElements.CheckboxField} />
        <SidebarBtnElement formElement={FormElements.FileField} />
        <SidebarBtnElement formElement={FormElements.ProductField} />
        <SidebarBtnElement formElement={FormElements.RegionField} />
      </div>
    </div>
  );
};

export default FormElementSidebar;
