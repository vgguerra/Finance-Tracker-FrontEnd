import React, { useState, useEffect } from "react";
import {
  getAllCategories,
  createCategory,
  deleteCategory,
  updateCategory,
} from "../services/categoryService";

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newCategoryName, setNewCategoryName] = useState("");

  const [editingCategory, setEditingCategory] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getAllCategories();
      setCategories(response.data);
      setError(null);
    } catch (err) {
      setError("Não foi possível carregar as categorias.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      alert("O nome da categoria não pode estar vazio.");
      return;
    }
    try {
      await createCategory({ name: newCategoryName });
      alert("Categoria criada com sucesso!");
      setNewCategoryName("");
      fetchCategories();
    } catch (err) {
      setError("Erro ao criar a categoria.");
      console.error(err);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm("Tem certeza que deseja excluir esta categoria?")) {
      try {
        await deleteCategory(categoryId);
        alert("Categoria excluída com sucesso!");
        fetchCategories();
      } catch (err) {
        setError("Erro ao excluir a categoria.");
        console.error(err);
      }
    }
  };

  const handleUpdateCategory = async (categoryId) => {
    if (!editingCategoryName.trim()) {
      alert("O nome da categoria não pode estar vazio.");
      return;
    }
    try {
      await updateCategory(categoryId, { name: editingCategoryName });
      alert("Categoria atualizada com sucesso!");
      setEditingCategory(null);
      setEditingCategoryName("");
      fetchCategories();
    } catch (err) {
      setError("Erro ao atualizar a categoria.");
      console.error(err);
    }
  };

  const handleEditClick = (category) => {
    setEditingCategory(category);
    setEditingCategoryName(category.name);
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditingCategoryName("");
  };

  if (loading) {
    return <p>Carregando categorias...</p>;
  }

  return (
    <div>
      <h1>Minhas Categorias</h1>

      <form onSubmit={handleCreateCategory}>
        <input
          type="text"
          placeholder="Nome da nova categoria"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <button type="submit">Adicionar Categoria</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {categories.map((category) => (
          <li key={category.id}>
            {editingCategory && editingCategory.id === category.id ? (
              <div>
                <input
                  type="text"
                  value={editingCategoryName}
                  onChange={(e) => setEditingCategoryName(e.target.value)}
                />
                <button onClick={() => handleUpdateCategory(category.id)}>
                  Salvar
                </button>
                <button onClick={handleCancelEdit}>Cancelar</button>
              </div>
            ) : (
              <div>
                <span>{category.name}</span>
                <button onClick={() => handleEditClick(category)}>
                  Editar
                </button>
                <button onClick={() => handleDeleteCategory(category.id)}>
                  Excluir
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoriesPage;
