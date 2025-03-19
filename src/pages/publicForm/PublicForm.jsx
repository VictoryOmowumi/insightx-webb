import React, { useState, useEffect } from 'react'
import { getPublicFormById, submitPublicForm } from '@/services/api';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast, Toaster } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Skeleton } from '@/components/ui/skeleton';
import { useParams, useNavigate } from 'react-router-dom';
const PublicForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({}); // Store user inputs
    

    useEffect(() => {
        const fetchForm = async () => {
            try {
                const data = await getPublicFormById(id);
                setForm(data);
                setLoading(false);
            } catch (error) {
                toast.error('Failed to fetch form: ' + error.message);
                setLoading(false);
            }
        };
        fetchForm();
    }, [id]);

    useEffect(() => {
        // Check if the form has already been submitted
        const hasSubmitted = localStorage.getItem(`form_${id}_submitted`);
        if (hasSubmitted) {
            navigate('/success', { replace: true });
        }
    }, [id, navigate]);



    const handleInputChange = (id, value) => {
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Prepare the payload
        const payload = {
            formId: id, // Form ID
            formData,
          
        };
        console.log('Payload being sent:', payload); // Debugging line
        try {
            await submitPublicForm(payload);
            setIsSubmitting(false);
            toast.success('Form submitted successfully!');
            setFormData({});
            // Mark the form as submitted in localStorage
            localStorage.setItem(`form_${id}_submitted`, 'true');

            // Redirect to the success page and prevent going back
            navigate('/success', { replace: true });

        } catch (error) {
            setIsSubmitting(false);
            toast.error('Failed to submit form: ' + error.message);
        }
    };

    if (loading) {
        return (
            <div className="p-6 space-y-4">
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
            </div>
        );
    }

    if (!form) {
        return <div className="p-6 text-red-500">Form not found.</div>;
    }

    const renderFormElement = (element) => {
        switch (element.type) {
            case 'TitleField':
                return (
                    <div key={element._id} className="text-2xl font-bold">
                        {element.extraAttributes.title}
                    </div>
                );
            case 'SubTitleField':
                return (
                    <div key={element._id} className="text-lg text-gray-600">
                        {element.extraAttributes.subtitle}
                    </div>
                );
            case 'ParagraphField':
                return (
                    <div key={element._id} className="text-gray-700">
                        {element.extraAttributes.text}
                    </div>
                );
            case 'SeparatorField':
                return <hr key={element._id} className="my-4 border-gray-300" />;
            case 'SpacerField':
                return <div key={element._id} style={{ height: `${element.extraAttributes.height}px` }} />;
            case 'TextField':
                return (
                    <div key={element._id} className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            {element.extraAttributes.label}
                            {element.extraAttributes.required && <span className="text-red-500"> *</span>}
                        </label>
                        <Input
                            type="text"
                            placeholder={element.extraAttributes.placeholder}
                            required={element.extraAttributes.required}
                            value={formData[element.id] || ''}
                            onChange={(e) => handleInputChange(element.id, e.target.value)}
                        />
                        {element.extraAttributes.helperText && (
                            <p className="text-sm text-gray-500">{element.extraAttributes.helperText}</p>
                        )}
                    </div>
                );
            case 'NumberField':
                return (
                    <div key={element._id} className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            {element.extraAttributes.label}
                            {element.extraAttributes.required && <span className="text-red-500"> *</span>}
                        </label>
                        <Input
                            type="number"
                            placeholder={element.extraAttributes.placeholder}
                            required={element.extraAttributes.required}
                            value={formData[element.id] || ''}
                            onChange={(e) => handleInputChange(element.id, e.target.value)}
                            // hide the number spinner
                            inputMode="numeric"

                        />
                        {element.extraAttributes.helperText && (
                            <p className="text-sm text-gray-500">{element.extraAttributes.helperText}</p>
                        )}
                    </div>
                );
            case 'TextAreaField':
                return (
                    <div key={element._id} className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            {element.extraAttributes.label}
                            {element.extraAttributes.required && <span className="text-red-500"> *</span>}
                        </label>
                        <Textarea
                            placeholder={element.extraAttributes.placeholder}
                            required={element.extraAttributes.required}
                            value={formData[element.id] || ''}
                            onChange={(e) => handleInputChange(element.id, e.target.value)}
                        />
                        {element.extraAttributes.helperText && (
                            <p className="text-sm text-gray-500">{element.extraAttributes.helperText}</p>
                        )}
                    </div>
                );
            case 'DateField':
                return (
                    <div key={element._id} className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            {element.extraAttributes.label}
                            {element.extraAttributes.required && <span className="text-red-500"> *</span>}
                        </label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className="w-full text-left"
                                >
                                    <CalendarFold size={20} strokeWidth={1} />
                                    {formData[element.id] || element.extraAttributes.placeholder}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent>
                                <Calendar
                                    onDateChange={(date) => handleInputChange(element.id, date)}
                                />
                            </PopoverContent>
                        </Popover>
                        {element.extraAttributes.helperText && (
                            <p className="text-sm text-gray-500">{element.extraAttributes.helperText}</p>
                        )}
                    </div>
                );
            case 'SelectField':
                return (
                    <div key={element._id} className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            {element.extraAttributes.label}
                            {element.extraAttributes.required && <span className="text-red-500"> *</span>}
                        </label>
                        <Select
                            required={element.extraAttributes.required}
                            onValueChange={(value) => handleInputChange(element.id, value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={element.extraAttributes.placeholder} />
                            </SelectTrigger>
                            <SelectContent>
                                {element.extraAttributes.options.map((option) => (
                                    <SelectItem key={option} value={option}>
                                        {option}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {element.extraAttributes.helperText && (
                            <p className="text-sm text-gray-500">{element.extraAttributes.helperText}</p>
                        )}
                    </div>
                );
            case 'CheckboxField':
                return (
                    <div key={element._id} className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            {element.extraAttributes.label}
                            {element.extraAttributes.required && <span className="text-red-500"> *</span>}
                        </label>
                        <Checkbox
                            checked={formData[element.id] || false}
                            onCheckedChange={(checked) => handleInputChange(element.id, checked)}
                            required={element.extraAttributes.required}
                        />
                        {element.extraAttributes.helperText && (
                            <p className="text-sm text-gray-500">{element.extraAttributes.helperText}</p>
                        )}
                    </div>
                );
            case 'FileField':
                return (
                    <div key={element._id} className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            {element.extraAttributes.label}
                            {element.extraAttributes.required && <span className="text-red-500"> *</span>}
                        </label>
                        <Input
                            type="file"
                            required={element.extraAttributes.required}
                            onChange={(e) => handleInputChange(element.id, e.target.files[0])}
                        />
                        {element.extraAttributes.helperText && (
                            <p className="text-sm text-gray-500">{element.extraAttributes.helperText}</p>
                        )}
                    </div>
                );
            case 'ProductField':
                return (
                    <div key={element._id} className="space-y-4">
                        <label className="text-lg  font-medium text-gray-700">
                            {element.extraAttributes.label}
                            {element.extraAttributes.required && <span className="text-red-500"> *</span>}
                        </label>
                        {element.extraAttributes.selectedProducts.map((product) => (
                            <div key={product.SKU} className="mt-2 p-4 border border-neutral-400 dark:border-neutral-700 rounded-4xl space-y-4">
                                <h3 className="font-medium">{product.Description}</h3>
                                <p className="text-sm text-gray-500">SKU: {product.SKU}</p>
                                {element.extraAttributes.fieldsToCollect.sellingPrice && (
                                    <div className="mt-2">
                                        <label className="text-sm text-gray-700">Selling Price</label>
                                        <Input
                                            type="number"
                                            placeholder="Enter selling price"
                                            value={formData[`${element.id}-${product.SKU}-sellingPrice`] || ''}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    `${element.id}-${product.SKU}-sellingPrice`,
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                )}
                                {element.extraAttributes.fieldsToCollect.availability && (
                                    <div className="mt-2">
                                        <label className="text-sm text-gray-700">Availability</label>
                                        <Select
                                            onValueChange={(value) =>
                                                handleInputChange(`${element.id}-${product.SKU}-availability`, value)
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select availability" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Available">Available</SelectItem>
                                                <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                                {element.extraAttributes.fieldsToCollect.stockQuantity && (
                                    <div className="mt-2">
                                        <label className="text-sm text-gray-700">Stock Quantity</label>
                                        <Input
                                            type="number"
                                            placeholder="Enter stock quantity"
                                            value={formData[`${element.id}-${product.SKU}-stockQuantity`] || ''}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    `${element.id}-${product.SKU}-stockQuantity`,
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col p-2 md:p-4 space-y-6 max-w-2xl mx-auto">



            {/* Form Elements */}
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-4 rounded-2xl">
                {form.elements.map((element) => renderFormElement(element))}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#f1642e] !p-4 rounded-2xl hover:bg-[#f1642e]/90">
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
            </form>
            <Toaster richColors />
            {/*  copy right */}
            <div className="text-center text-gray-500 text-sm">
                <p>&copy; {new Date().getFullYear()} Seven-up Bottling Company Ltd. All rights reserved</p>
            </div>
        </div>
    )
}

export default PublicForm