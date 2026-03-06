import React, { useState, useEffect} from "react";
import { Modal, Button } from "../vibes";
import { COLORS } from "../constants/colors";
import {Category, CategoryFormData} from "../types";
import { CategoryFrom } from "../components/CategoryForm";
import { createCategory } from "../services/api";


const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddCategory = async (data: CategoryFormData) => {
    try{
      await createCategory(data);
      setIsModalOpen(false);
    }catch(error){
      console.error("Error creating category: ", error);
      throw error;
    }
  };

  const pageStyle: React.CSSProperties = {
    padding: "48px 64px",
    minHeight: "100vh",
    background: COLORS.secondary.s01,
  };

  const headerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "24px",
    justifyContent: "space-between",
  };

  const leftHeaderStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "24px",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "40px",
    fontWeight: 700,
    color: COLORS.secondary.s10,
    margin: 0,
    flexShrink: 0,
  };

  const loadingStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "48px",
    fontSize: "18px",
    color: COLORS.secondary.s08,
  };


  
  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <div style={leftHeaderStyle}>
          <h1 style={titleStyle}>Category Management</h1>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          Add Category
        </Button>
      </div>

      <Modal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      title="Add new category"
      >
        <CategoryFrom
        onSubmit={handleAddCategory}
        onCancel={() => setIsModalOpen(false)}></CategoryFrom>
      </Modal>
    </div>
  );
}




export default CategoriesPage;