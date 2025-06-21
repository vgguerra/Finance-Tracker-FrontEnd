import React, { useState, useEffect } from 'react';
// Importa a função do nosso serviço!
import { getAllCategories } from '../services/categoryService';

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Função assíncrona para buscar os dados
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response.data); // O axios coloca os dados em response.data
      } catch (err) {
        setError('Não foi possível carregar as categorias.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []); // O array vazio [] garante que isso rode apenas uma vez

  if (loading) {
    return <p>Carregando categorias...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div>
      <h1>Minhas Categorias</h1>
      <ul>
        {categories.map(category => (
          <li key={category.id}>{category.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default CategoriesPage;