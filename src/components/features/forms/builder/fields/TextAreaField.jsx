import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import useDesigner from "@/hooks/useDesigner";
import {
  Form,
  FormControl,
  FormDescription,
  FormLabel,
  FormItem,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { BsTextarea } from "react-icons/bs";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";

const type = "TextAreaField";
const extraAttributes = {
  label: "Text Area Field",
  placeholder: "Enter text here",
  helperText: "This is a text area field",
  required: false,
  rows: 3,
};

const propertiesSchema = yup.object({
  label: yup.string().min(2).max(50),
  placeholder: yup.string().min(2).max(20),
  helperText: yup.string().max(100),
  required: yup.boolean().default(false),
  rows: yup.number().min(1).max(10),
});

export const TextAreaFieldFormElement = {
  type,
  construct: (id) => ({
    id,
    type,
    extraAttributes,
  }),
  designerBtnElement: {
    icon: BsTextarea,
    label: "Textarea Field",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
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
      <Textarea
        rows={elements?.extraAttributes?.rows}
        readOnly
        disabled
        placeholder={elementInstance?.extraAttributes?.placeholder}
      />
      {elements?.extraAttributes?.helperText && (
        <p className="text-[0.7rem] text-muted-foreground">
          {elements.extraAttributes.helperText}
        </p>
      )}
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
      label: element.extraAttributes.label,
      placeholder: element.extraAttributes.placeholder,
      helperText: element.extraAttributes.helperText,
      required: element.extraAttributes.required,
      rows: element.extraAttributes.rows,
    },
  });

  useEffect(() => {
    form.reset(element.extraAttributes);
  }, [element, form]);

  function applyChanges(values) {
    updateElement(element.id, {
      ...element,
      extraAttributes: {
        label: values.label,
        placeholder: values.placeholder,
        helperText: values.helperText,
        required: values.required,
        rows: values.rows,
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
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="label">Label</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                  }}
                />
              </FormControl>
              <FormDescription className="text-muted-foreground text-xs">
                The label of the text area field. It will be displayed above
                the field
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rows"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="rows">Rows {form.watch("rows")} </FormLabel>
              <FormControl>
                <Slider
                  min={1}
                  max={10}
                  step={1}
                  defaultValue={[field.value]}
                  onValueChange={(value) => {
                    field.onChange(value[0]);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="placeholder"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="placeholder">Placeholder</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                  }}
                />
              </FormControl>
              <FormDescription className="text-muted-foreground text-xs">
                The placeholder of the text area field. It will be displayed
                inside the field
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="helperText"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="helperText">Helper Text</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                  }}
                />
              </FormControl>
              <FormDescription className="text-muted-foreground text-xs">
                The helper text of the text area field. It will be displayed
                below the field
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="required"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0 5">
                <FormLabel htmlFor="required">Required</FormLabel>
                <FormDescription className="text-muted-foreground text-xs">
                  Indicates if the text area field is required. A red asterisk will appear next to the label if true.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    form.handleSubmit(applyChanges)();
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
    <div className="flex flex-col gap-2 w-full">
      <Label>
        {elements?.extraAttributes?.label}
        {elements?.extraAttributes?.required && (
          <span className="text-red-500">*</span>
        )}
      </Label>
      <Textarea
        rows={elements?.extraAttributes?.rows}
        placeholder={elementInstance?.extraAttributes?.placeholder}
      />
      {elements?.extraAttributes?.helperText && (
        <p className="text-[0.7rem] text-muted-foreground">
          {elements.extraAttributes.helperText}
        </p>
      )}
    </div>
  );
}