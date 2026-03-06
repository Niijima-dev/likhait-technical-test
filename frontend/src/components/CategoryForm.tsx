import React, { useState } from "react";
import { CategoryFormData } from "../types";
import { TextField, Button } from "../vibes";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { useCategoryForm } from "../hooks/useCategoriesForm";

interface CategoryFormProps{
    initialData?: Partial<CategoryFormData>;
    onSubmit: (data: CategoryFormData) => Promise<void>;
    onCancel?: () => void;
    submitLabel?: string;
}

export function CategoryFrom({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Add Category",
}: CategoryFormProps) {
  const {formData, errors, isSubmitting, handleChange, handleSubmit} = 
  useCategoryForm({
    initialData,
    onSubmit,
  });

  const [showPicker, setShowPicker] = useState(false);

  const handleIconClick = (iconData: EmojiClickData) => {
    handleChange("icon", iconData.emoji)
    setShowPicker(false);
  };

  const formStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  };

  const buttonGroupStyle: React.CSSProperties = {
    display: "flex",
    gap: "0.5rem",
    marginTop: "0.5rem",
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <TextField
        label="Category name"
        type="text"
        placeholder="Enter category name"
        value={formData.name}
        onChange={(e) => handleChange("name", e.target.value)}
        error={errors.name}
        fullWidth
        required
      />

       <div style={{cursor: "pointer"}} 
       onClick={() => setShowPicker(!showPicker)}>
        <TextField
          label="Icon"
          type="text"
          placeholder="Select Icon"
          value={formData.icon}
          readOnly
          error={errors.icon}
          fullWidth
          required  
        />

      {showPicker && (
        <div style={{marginTop: "8px"}}>
          <EmojiPicker onEmojiClick={handleIconClick}/>
        </div>
      )}
       </div>

       <div style={buttonGroupStyle}>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            fullWidth
          >
            {isSubmitting ? "Submitting..." : submitLabel}
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
        </div>
    </form>
  );
}
