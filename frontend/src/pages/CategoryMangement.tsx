import React, { useState, useEffect } from "react";
import { Modal, Button } from "../vibes";
import { COLORS } from "../constants/colors";
import { Category, CategoryFormData, Expense } from "../types";
import { CategoryFrom } from "../components/CategoryForm";
import {
  createCategory,
  fetchCategories,
  fetchExpenses,
  getExpenses,
} from "../services/api";
import { CategoryTable } from "../components/CategoryTable";

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddCategory = async (data: CategoryFormData) => {
    try {
      await createCategory(data);
      setIsModalOpen(false);
      getCategories();
    } catch (error) {
      console.error("Error creating category: ", error);
      throw error;
    }
  };

  const getCategories = async () => {
    try {
      setLoading(true);
      const [expenseData, categoryData] = await Promise.all([
        fetchExpenses(),
        fetchCategories(),
      ]);

      const data = categoryData.map((category) => {
        const count = expenseData.filter(
          (e) => e.category === category.name,
        ).length;
        return { ...category, count };
      });

      setCategories(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

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

  const subHeadingStyle: React.CSSProperties = {
  fontSize: "20px",
  fontWeight: 600,
  color: COLORS.secondary.s08,
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
      <h2 style={subHeadingStyle}>Create, Edit, and Delete Categories</h2>
      <div>
        {loading ? (
          <div style={loadingStyle}>Loading...</div>
        ) : (
          <>
            <CategoryTable
              categories={categories}
              onCategoryUpdated={getCategories}
            />

            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title="Add new category"
            >
              <CategoryFrom
                onSubmit={handleAddCategory}
                onCancel={() => setIsModalOpen(false)}
              ></CategoryFrom>
            </Modal>  
          </>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
