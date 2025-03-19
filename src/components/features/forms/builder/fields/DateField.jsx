import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
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
import { BsCalendar } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { CalendarDaysIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import moment from "moment";

const type = "DateField";
const extraAttributes = {
  label: "Date Field",
  helperText: "This is a date field",
  required: false,
  defaultValue: "",
};

const propertiesSchema = yup.object({
  label: yup.string().min(2).max(50),
  helperText: yup.string().max(100),
  required: yup.boolean().default(false),
  defaultValue: yup.string(),
});

export const DateFieldFormElement = {
  type,
  construct: (id) => ({
    id,
    type,
    extraAttributes,
  }),
  designerBtnElement: {
    icon: BsCalendar,
    label: "Date Field",
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
      <Button
        variant={"outline"}
        className="w-full justify-start text-left font-normal"
      >
        <CalendarDaysIcon size={16} className="mr-2" />
        <span>Select Date</span>
      </Button>
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
      helperText: element.extraAttributes.helperText,
      required: element.extraAttributes.required,
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
        helperText: values.helperText,
        required: values.required,
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
                The label of the text area field. It will be displayed above the
                field
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
                  Indicates if the text area field is required. A red asterisk
                  will appear next to the label if true.
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
  const defaultValue = elements?.extraAttributes?.defaultValue;
  const [date, setDate] = useState(defaultValue ? new Date(defaultValue) : undefined);

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label>
        {elements?.extraAttributes?.label}
        {elements?.extraAttributes?.required && (
          <span className="text-red-500">*</span>
        )}
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarDaysIcon size={16} className="mr-2" />
            {date ? moment(date).format("LL") : <span>Select Date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 " align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date) => {
              setDate(date);
            }}
          />
        </PopoverContent>
      </Popover>
      {elements?.extraAttributes?.helperText && (
        <p className="text-[0.7rem] text-muted-foreground">
          {elements.extraAttributes.helperText}
        </p>
      )}
    </div>
  );
}