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
import { BiParagraph } from "react-icons/bi";
import { Textarea } from "@/components/ui/textarea";

const type = "ParagraphField";
const extraAttributes = {
  paragraph: "Enter Text",
};

const propertiesSchema = yup.object({
  paragraph: yup.string().min(2).max(500),
});

export const ParagraphFieldFormElement = {
  type,
  construct: (id) => ({
    id,
    type,
    extraAttributes,
  }),
  designerBtnElement: {
    icon: BiParagraph,
    label: "Paragraph Field",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
};

function DesignerComponent({ elementInstance }) {
  const elements = elementInstance;

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label>Paragraph Field</Label>
      <p className="text-sm"> {elements?.extraAttributes?.paragraph}</p>
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
      paragraph: element.extraAttributes.paragraph,
    },
  });

  useEffect(() => {
    form.reset(element.extraAttributes);
  }, [element, form]);

  function applyChanges(values) {
    updateElement(element.id, {
      ...element,
      extraAttributes: {
        paragraph: values.paragraph,
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
          name="paragraph"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="paragraph">Paragraph Text</FormLabel>
              <FormControl>
                <Textarea
                  rows={5}
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
    <p className="text-sm text-muted-foreground">
      {elements?.extraAttributes?.paragraph}
    </p>
  );
}