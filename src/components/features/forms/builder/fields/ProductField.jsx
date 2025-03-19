import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import * as yup from "yup";
import useDesigner from "@/hooks/useDesigner";
import { Switch } from "@/components/ui/switch";
import { BsCart2} from "react-icons/bs";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { fetchProducts } from "@/services/api";
import { X, ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
const type = "ProductField";
const extraAttributes = {
  label: "Product Information",
  required: false,
  products: [], // Array to store multiple products
};

const propertiesSchema = yup.object({
  label: yup.string().min(2).max(50),
  required: yup.boolean().default(false),
});

export const ProductFieldFormElement = {
  type,
  construct: (id) => ({
    id,
    type,
    extraAttributes,
  }),
  designerBtnElement: {
    icon: BsCart2,
    label: "Product Field",
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
        Add multiple products with their details.
      </p>
    </div>
  );
}

function PropertiesComponent({ elementInstance }) {
  const element = elementInstance;
  const { updateElement, setSelectedElement } = useDesigner();
  const [productList, setProductList] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [fieldsToCollect, setFieldsToCollect] = useState({
    sellingPrice: true,
    availability: true,
    stockQuantity: true,
    buyingPrice: true,
  });
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    fetchProducts().then((data) => setProductList(data));
  }, []);

  const handleProductSelection = (productId) => {
    const product = productList.find((p) => p.SKU === productId);
    if (product && !selectedProducts.some((p) => p.SKU === productId)) {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const handleFieldToggle = (field) => {
    setFieldsToCollect((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const applyChanges = () => {
    updateElement(element.id, {
      ...element,
      extraAttributes: {
        ...element.extraAttributes,
        selectedProducts,
        fieldsToCollect,
      },
    });
    toast({
      title: "Success",
      description: "Product field updated successfully",
    });
    setSelectedElement(null);
  };

  return (
    <div className="space-y-4">
      <div>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              {value
                ? productList.find((product) => product.SKU === value)?.Description
                : "Select a product"}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search product..." className="h-9" />
              <CommandList>
                <CommandEmpty>No product found.</CommandEmpty>
                <CommandGroup>
                  {productList.map((product) => (
                    <CommandItem
                      key={product.SKU}
                      value={product.SKU}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue);
                        handleProductSelection(currentValue);
                        setOpen(false);
                      }}
                    >
                      {product.Description}
                      <Check
                        className={cn(
                          "ml-auto",
                          value === product.SKU ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {selectedProducts.length > 0 && (
        <div className="space-y-2">
          <Label>Selected Products</Label>
          
          <table className="w-full mt-3 border border-gray-300 dark:border-gray-700">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {selectedProducts.map((product) => (
                <tr key={product.SKU} className="border-t border-gray-300 dark:border-gray-700">
                  <td className="px-4 py-2">{product.Description}</td>
                  <td className="px-4 py-2">
                    <Button
                      variant="icon"
                      size="sm"
                      onClick={() =>
                        setSelectedProducts(selectedProducts.filter((p) => p.SKU !== product.SKU))
                      }
                    >
                      <X size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div>
        <h3>Select Fields to Collect</h3>
        <div className="flex flex-col gap-4 mt-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={fieldsToCollect.sellingPrice}
              onCheckedChange={() => handleFieldToggle("sellingPrice")}
            />
            <Label>Selling Price</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={fieldsToCollect.availability}
              onCheckedChange={() => handleFieldToggle("availability")}
            />
            <Label>Availability</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={fieldsToCollect.stockQuantity}
              onCheckedChange={() => handleFieldToggle("stockQuantity")}
            />
            <Label>Stock Quantity</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={fieldsToCollect.buyingPrice}
              onCheckedChange={() => handleFieldToggle("buyingPrice")}
            />
            <Label>Buying Price</Label>
          </div>
        </div>
      </div>

      <Button onClick={applyChanges} className="float-right">Save</Button>
    </div>
  );
}

function FormComponent({ elementInstance }) {
  const elements = elementInstance;
  const [productList, setProductList] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    fetchProducts().then((data) => setProductList(data));
  }, []);

  useEffect(() => {
    // If the form builder has selected products, use those. Otherwise, use the full list.
    if (elements.extraAttributes.selectedProducts?.length > 0) {
      setSelectedProducts(
        elements.extraAttributes.selectedProducts.map((product) => ({
          ...product,
          sellingPrice: "",
          availability: false,
          stockQuantity: "",
        }))
      );
    } else {
      setSelectedProducts(
        productList.map((product) => ({
          ...product,
          sellingPrice: "",
          availability: false,
          stockQuantity: "",
        }))
      );
    }
  }, [elements.extraAttributes.selectedProducts, productList]);

  const handleFieldChange = (productId, field, value) => {
    const updatedProducts = selectedProducts.map((p) =>
      p.SKU === productId ? { ...p, [field]: value } : p
    );
    setSelectedProducts(updatedProducts);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label>
        {elements?.extraAttributes?.label}
        {elements?.extraAttributes?.required && (
          <span className="text-red-500">*</span>
        )}
      </Label>

      {selectedProducts.map((product) => (
        <div key={product.SKU} className="flex flex-col gap-2 border p-2 rounded">
          <Label>{product.Description}</Label>
          {(elements.extraAttributes.fieldsToCollect?.sellingPrice ||
            !elements.extraAttributes.fieldsToCollect) && (
              <Input
                placeholder="Selling Price"
                type="number"
                value={product.sellingPrice}
                onChange={(e) =>
                  handleFieldChange(product.SKU, "sellingPrice", e.target.value)
                }
              />
            )}
          {(elements.extraAttributes.fieldsToCollect?.availability ||
            !elements.extraAttributes.fieldsToCollect) && (
              <div className="flex items-center gap-2">
                <Switch
                  checked={product.availability}
                  onCheckedChange={(checked) =>
                    handleFieldChange(product.SKU, "availability", checked)
                  }
                />
                <Label>Available</Label>
              </div>
            )}
          {(elements.extraAttributes.fieldsToCollect?.stockQuantity ||
            !elements.extraAttributes.fieldsToCollect) && (
              <Input
                placeholder="Stock Quantity"
                type="number"
                value={product.stockQuantity}
                onChange={(e) =>
                  handleFieldChange(product.SKU, "stockQuantity", e.target.value)
                }
              />
            )}
        </div>
      ))}
    </div>
  );
}