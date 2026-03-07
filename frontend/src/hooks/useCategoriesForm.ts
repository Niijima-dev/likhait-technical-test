import React, { useState } from "react";
import { CategoryFormData } from "../types";

interface UseCategoryFormProps  {
    initialData?: Partial<CategoryFormData>;
    onSubmit: (data: CategoryFormData)  => Promise<void>;
}

export function useCategoryForm({ initialData, onSubmit}: UseCategoryFormProps) {
    const [formData, setFormData] = useState<CategoryFormData>({
        name: initialData?.name || "",
        icon: initialData?.icon || "",
    });

    const [errors, setErrors] = useState<Partial<CategoryFormData>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (field: keyof CategoryFormData, value: string) => {
        setFormData((prev) => ({...prev, [field]: value}));

        if(errors[field]){
            setErrors((prev) => ({ ...prev, [field]: value}));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<CategoryFormData> = {};

        if (!formData.name.trim()){
            newErrors.name = "Category name is required";
        }

        if (!formData.icon.trim()){
            newErrors.icon = "Category icon is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if(!validateForm()){
            return;
        }

        setIsSubmitting(true);

        try{
            await onSubmit(formData);

            setFormData({
                name: "",
                icon: "",
            });
            setErrors({});
        }catch (error){
            console.error("Form submission error: ", error);
        }finally{
            setIsSubmitting(false);
        }
    };

    const resetForm  = () => {
        setFormData({
            name: initialData?.name || "",
            icon: initialData?.icon || "",
        });
        setErrors({});
    };

    return{
        formData,
        errors,
        isSubmitting,
        handleChange,
        handleSubmit,
        resetForm,
    };
}