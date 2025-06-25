import React, { use, useEffect, useState } from "react";
import {
  createTransaction,
  getAllTransactions,
} from "../services/TransactionsService";

import { getAllCategories } from "../services/categoryService";

const TransactionsPage = () => {
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [categoriesError, setCategoriesError] = useState(null);
  const [error, setError] = useState(null);

  const [newTransactionDescription, setNewTransactionDescription] =
    useState("");
  const [newTransactionValue, setNewTransactionValue] = useState("");
  const [newTransactionDate, setNewTransactionDate] = useState("");
  const [newTransactionType, setNewTransactionType] = useState("");
  const [newTransactionCategory, setNewTransactionCategory] = useState("");

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await getAllTransactions();
      setTransactions(response.data);
      setError(null);
    } catch (err) {
      setError("Não foi possível carregar as transações.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await getAllCategories(); 
      setCategories(response.data);
      setCategoriesError(null);
    } catch (err) {
      setCategoriesError(
        "Não foi possível carregar as categorias para seleção."
      );
      console.error(err);
    } finally {
      setCategoriesLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, []);

  const handleCreateTransaction = async (e) => {
    e.preventDefault();
    if (
      !newTransactionDescription.trim() ||
      !newTransactionValue.trim() ||
      !newTransactionDate.trim() ||
      !newTransactionType.trim() ||
      !newTransactionCategory.trim()
    ) {
      alert("Todos os campos devem estar preenchidos.");
      return;
    }
    try {
      await createTransaction({
        description: newTransactionDescription,
        value: parseFloat(newTransactionValue),
        date: newTransactionDate,
        type: newTransactionType,
        categoryId: newTransactionCategory,
      });

      alert("Transação criada com sucesso!");

      setNewTransactionDescription("");
      setNewTransactionValue("");
      setNewTransactionDate("");
      setNewTransactionType("");
      setNewTransactionCategory("");

      fetchTransactions();
    } catch (err) {
      setError("Erro ao criar a Transação.");
      console.error(err);
    }
  };

  if (loading) {
    return <p>Carregando transações...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (transactions.length === 0) {
    return (
      <div>
        <h1>Minhas Transações</h1>
        <p>Nenhuma transação encontrada.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Minhas Transações</h1>
      <form onSubmit={handleCreateTransaction}>
        <input
          type="text"
          placeholder="Descrição da transação"
          value={newTransactionDescription}
          onChange={(e) => setNewTransactionDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Valor da transação"
          value={newTransactionValue}
          onChange={(e) => setNewTransactionValue(e.target.value)}
        />
        <input
          type="date"
          placeholder="Data da transação"
          value={newTransactionDate}
          onChange={(e) => setNewTransactionDate(e.target.value)}
        />
        <select
          value={newTransactionType}
          onChange={(e) => setNewTransactionType(e.target.value)}
        >
          <option value="EXPENSE">Despesa</option>
          <option value="INCOME">Receita</option>
        </select>
        {categoriesLoading ? (
          <p>Carregando categorias...</p>
        ) : categoriesError ? (
          <p style={{ color: "red" }}>{categoriesError}</p>
        ) : (
          <select
            value={newTransactionCategory}
            onChange={(e) => setNewTransactionCategory(e.target.value)}
          >
            <option value="">Selecione uma categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        )}

        <button type="submit">Adicionar Transação</button>
      </form>
      <ul>
        {transactions.map((transaction) => (
          <li
            key={transaction.id}
            style={{
              marginBottom: "10px",
              border: "1px solid #ccc",
              padding: "8px",
              borderRadius: "4px",
            }}
          >
            <p>
              <strong>Descrição:</strong> {transaction.description}
            </p>
            <p>
              <strong>Valor:</strong> R$ {transaction.value.toFixed(2)}
            </p>
            <p>
              <strong>Data:</strong> {transaction.date}
            </p>
            <p>
              <strong>Tipo:</strong>{" "}
              {transaction.type === "EXPENSE" ? "Despesa" : "Receita"}
            </p>
            <p>
              <strong>Categoria:</strong>{" "}
              {transaction.category ? transaction.category.name : "N/A"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionsPage;
