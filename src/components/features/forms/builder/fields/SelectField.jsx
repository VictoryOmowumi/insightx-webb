import { RxDropdownMenu } from "react-icons/rx";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { AiOutlinePlus } from "react-icons/ai";
import { Trash } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const type = "SelectField";
const extraAttributes = {
  label: "Select Field",
  placeholder: "Select an option",
  helperText: "This is a select field",
  required: false,
  options: [],
};

const propertiesSchema = yup.object({
  label: yup.string().min(2).max(50),
  placeholder: yup.string().min(2).max(20),
  helperText: yup.string().max(100),
  required: yup.boolean().default(false),
  options: yup.array().of(yup.string()).default([]),
});

export const SelectFieldFormElement = {
  type,
  construct: (id) => ({
    id,
    type,
    extraAttributes,
  }),
  designerBtnElement: {
    icon: RxDropdownMenu,
    label: "Select Field",
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
      <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={elements?.extraAttributes?.placeholder} />
        </SelectTrigger>
      </Select>
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
  const { updateElement, setSelectedElement } = useDesigner();
  const form = useForm({
    resolver: yupResolver(propertiesSchema),
    mode: "onSubmit",
    defaultValues: {
      label: element.extraAttributes.label,
      placeholder: element.extraAttributes.placeholder,
      helperText: element.extraAttributes.helperText,
      required: element.extraAttributes.required,
      options: element.extraAttributes.options,
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
        options: values.options,
      },
    });
    toast({
      title: "Success",
      description: "Select field updated successfully",
    });
    setSelectedElement(null);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(applyChanges)}
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
                The label of the text field. It will be displayed above the
                field
              </FormDescription>
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
                The placeholder of the select field. It will be displayed inside
                the field
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
                The helper text of the select field. It will be displayed below
                the field
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
        <FormField
          control={form.control}
          name="options"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel htmlFor="options">Add Options</FormLabel>
                <Button
                  variant={"outline"}
                  className="gap-2"
                  onClick={(e) => {
                    e.preventDefault();
                    form.setValue("options", field.value.concat(""));
                  }}
                >
                  <AiOutlinePlus />
                  Add
                </Button>
              </div>

              <div className="flex flex-col gap-2">
                {form.watch("options").map((option, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      value={option}
                      onChange={(e) => {
                        const newOptions = field.value;
                        newOptions[index] = e.target.value;
                        form.setValue("options", newOptions);
                      }}
                      className="!shadow-none"
                      placeholder="Option"
                    />
                    <Button
                      variant={"destructive"}
                      size={"icon"}
                      onClick={(e) => {
                        e.preventDefault();
                        const newOptions = field.value;
                        newOptions.splice(index, 1);
                        form.setValue("options", newOptions);
                      }}
                    >
                      <Trash size={12} />
                    </Button>
                  </div>
                ))}
              </div>
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
                  Indicates if the select field is required. A red asterisk will
                  appear next to the label if true.
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
        <Separator />
        <Button className="w-full" type="submit">
          Save
        </Button>
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
      <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={elements?.extraAttributes?.placeholder} />
        </SelectTrigger>
        <SelectContent>
          {elements?.extraAttributes?.options.map((option, index) => (
            <SelectItem key={index} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {elements?.extraAttributes?.helperText && (
        <p className="text-[0.7rem] text-muted-foreground">
          {elements.extraAttributes.helperText}
        </p>
      )}
    </div>
  );
}