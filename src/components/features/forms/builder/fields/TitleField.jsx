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
  FormLabel,
  FormItem,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { LucideHeading1 } from "lucide-react";

const type = "TitleField";
const extraAttributes = {
  title: "Title Field",
};

const propertiesSchema = yup.object({
  title: yup.string().min(2).max(50),
});

export const TitleFieldFormElement = {
  type,
  construct: (id) => ({
    id,
    type,
    extraAttributes,
  }),
  designerBtnElement: {
    icon: LucideHeading1,
    label: "Title Field",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
};

function DesignerComponent({ elementInstance }) {
  const elements = elementInstance;
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label>Title Field</Label>
      <p className="text-xl"> {elements?.extraAttributes?.title}</p>
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
      title: element.extraAttributes.title,
    },
  });

  useEffect(() => {
    form.reset(element.extraAttributes);
  }, [element, form]);

  function applyChanges(values) {
    updateElement(element.id, {
      ...element,
      extraAttributes: {
        title: values.title,
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="title">Title</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
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
    <p className="text-xl">{elements?.extraAttributes?.title}</p>
  );
}