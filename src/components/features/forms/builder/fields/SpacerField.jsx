import { Label } from "@/components/ui/label";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import useDesigner from "@/hooks/useDesigner";
import {
  Form,
  FormControl,
  FormLabel,
  FormItem,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { LucideSeparatorHorizontal, LucideSpace } from "lucide-react";
import { Slider } from "@/components/ui/slider";

const type = "SpacerField";
const extraAttributes = {
  height: 20, // px
};

const propertiesSchema = yup.object({
  height: yup.number().min(5).max(200),
});

export const SpacerFieldFormElement = {
  type,
  construct: (id) => ({
    id,
    type,
    extraAttributes,
  }),
  designerBtnElement: {
    icon: LucideSpace,
    label: "Space Field",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
};

function DesignerComponent({ elementInstance }) {
  const elements = elementInstance;

  return (
    <div className="flex flex-col gap-2 w-full items-center">
      <Label>Space Field {elements?.extraAttributes?.height}px </Label>
      <LucideSeparatorHorizontal className="h-8 w-8" />
    </div>
  );
}

function PropertiesComponent({ elementInstance }) {
  const element = elementInstance;
  const { updateElement } = useDesigner();
  const form = useForm({
    resolver: yupResolver(propertiesSchema),
    mode: "onBlur",
    defaultValues: {
      height: element.extraAttributes.height,
    },
  });

  useEffect(() => {
    form.reset(element.extraAttributes);
  }, [element, form]);

  function applyChanges(values) {
    updateElement(element.id, {
      ...element,
      extraAttributes: {
        height: values.height,
      },
    });
  }

  return (
    <Form {...form}>
      <form
        onBlur={form.handleSubmit(applyChanges)}
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="height"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="height">Height (px): {form.watch("height")} </FormLabel>
              <FormControl className="pt-2">
                <Slider
                  defaultValue={[field.value]}
                  min={5}
                  max={200}
                  step={1}
                  onValueChange={(value) => {
                    field.onChange(value[0]);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

function FormComponent({ elementInstance }) {
  const elements = elementInstance;
  return (
    <div
      className=""
      style={{
        height: elements?.extraAttributes?.height,
        width: "100%",
      }}
    ></div>
  );
}