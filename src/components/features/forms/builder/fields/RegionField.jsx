import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import * as yup from "yup";
import useDesigner from "@/hooks/useDesigner";
import { toast } from "@/hooks/use-toast";
import { getRegions } from "@/services/api";
import { Button } from "@/components/ui/button";
import { PiMapPinAreaLight } from "react-icons/pi";
const type = "RegionField";
const extraAttributes = {
  label: "Region",
  required: false,
  region: "",
};

const propertiesSchema = yup.object({
  label: yup.string().min(2).max(50),
  required: yup.boolean().default(false),
});

export const RegionFieldFormElement = {
  type,
  construct: (id) => ({
    id,
    type,
    extraAttributes,
  }),
  designerBtnElement: {
    icon: PiMapPinAreaLight,
    label: "Region Field",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,

  validate: (formElement, currentValue) => {
    const element = formElement;
    if (element.extraAttributes.required) {
      return currentValue.length > 0;
    }
    return true;
  },
};

function DesignerComponent({ elementInstance }) {
  const elements = elementInstance;

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label>
        {elements?.extraAttributes?.label}
        {elements?.extraAttributes?.required && (
          <span className="text-red-500">*</span>
        )}
      </Label>
      <p className="text-[0.7rem] text-muted-foreground">
        Select a region from the dropdown.
      </p>
    </div>
  );
}

function PropertiesComponent({ elementInstance }) {
  const element = elementInstance;
  const { updateElement, setSelectedElement } = useDesigner();
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");

  useEffect(() => {
    getRegions().then((data) => setRegions(data));
  }, []);

  const applyChanges = () => {
    updateElement(element.id, {
      ...element,
      extraAttributes: {
        ...element.extraAttributes,
        region: selectedRegion,
      },
    });
    toast({
      title: "Success",
      description: "Region field updated successfully",
    });
    setSelectedElement(null);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Select Region</Label>
        <Select
          value={selectedRegion}
          onValueChange={(value) => setSelectedRegion(value)}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Region" />
          </SelectTrigger>
          <SelectContent>
            {regions.map((region) => (
              <SelectItem key={region.code} value={region.code}>
                {region.description}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button onClick={applyChanges} className="float-right">Save</Button>
    </div>
  );
}

function FormComponent({ elementInstance }) {
  const elements = elementInstance;
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");

  useEffect(() => {
    getRegions().then((data) => setRegions(data));
  }, []);

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label>
        {elements?.extraAttributes?.label}
        {elements?.extraAttributes?.required && (
          <span className="text-red-500">*</span>
        )}
      </Label>
      <Select
        value={selectedRegion}
        onValueChange={(value) => setSelectedRegion(value)}
        required
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Region" />
        </SelectTrigger>
        <SelectContent>
          {regions.map((region) => (
            <SelectItem key={region.code} value={region.code}>
              {region.description}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}