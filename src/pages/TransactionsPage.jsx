import React, { use, useEffect, useState } from "react";
import {
  createTransaction,
  getAllTransactions,
  deleteTransaction,
  updateTransaction
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

  const [editingTransaction, setEditingTransaction] = useState(null);
  const [editingFormData, setEditingFormData] = useState({
    description: "",
    value: "",
    date: "",
    type: "",
    categoryId: "",
  });

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await getAllTransactions();
      setTransactions(response.data);
      console.log("Fetched transactions:", response.data);
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

const handleDeleteTransaction = async (transactionId) => {
    if (window.confirm("Tem certeza que deseja excluir esta transação?")) {
      try {
        await deleteTransaction(transactionId);
        alert("Transação excluída com sucesso!");
        fetchTransactions(); 
      } catch (err) {
        setError("Erro ao excluir a transação.");
        console.error(err);
      }
    }
  };

    const handleUpdateTransaction = async (e) => {
    e.preventDefault();
    if (
        !editingFormData.description.trim() ||
        !editingFormData.value.toString().trim() ||
        !editingFormData.date.trim() ||
        !editingFormData.type.trim() ||
        !editingFormData.categoryId.toString().trim()
      ) {
        alert("Todos os campos devem estar preenchidos.");
        return;
      }
    try {
      await updateTransaction(editingTransaction.id, {
        ...editingFormData,
        value: parseFloat(editingFormData.value)
      });
      alert("Transação atualizada com sucesso!");
      setEditingTransaction(null); 
      fetchTransactions();
    } catch (err) {
      setError("Erro ao atualizar a transação.");
      console.error(err);
    }
  };

  const handleEditClick = (transaction) => {
    setEditingTransaction(transaction);
    setEditingFormData({
      description: transaction.description,
      value: transaction.value,
      date: transaction.date,
      type: transaction.type,
      categoryId: transaction.category.id,
    });
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
  };

  
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditingFormData(prev => ({...prev, [name]: value}))
  }

  if (loading) {
    return <p>Carregando transações...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
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
              marginBottom: "20px",
              border: "1px solid #ccc",
              padding: "10px",
              borderRadius: "4px",
            }}
          >
            {editingTransaction && editingTransaction.id === transaction.id ? (
              <form onSubmit={handleUpdateTransaction}>
                <input
                    name="description"
                    value={editingFormData.description}
                    onChange={handleEditFormChange}
                    placeholder="Descrição"
                />
                <input
                    type="number"
                    name="value"
                    value={editingFormData.value}
                    onChange={handleEditFormChange}
                    placeholder="Valor"
                />
                <input
                    type="date"
                    name="date"
                    value={editingFormData.date}
                    onChange={handleEditFormChange}
                />
                 <select name="type" value={editingFormData.type} onChange={handleEditFormChange}>
                    <option value="EXPENSE">Despesa</option>
                    <option value="INCOME">Receita</option>
                </select>
                <select name="categoryId" value={editingFormData.categoryId} onChange={handleEditFormChange}>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>

                <button type="submit">Salvar</button>
                <button type="button" onClick={handleCancelEdit}>Cancelar</button>
              </form>
            ) : (
              <div>
                <p><strong>Descrição:</strong> {transaction.description}</p>
                <p><strong>Valor:</strong> R$ {transaction.value.toFixed(2)}</p>
                <p><strong>Data:</strong> {new Date(transaction.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p>
                <p><strong>Tipo:</strong> {transaction.type === "EXPENSE" ? "Despesa" : "Receita"}</p>
                <p><strong>Categoria:</strong> {transaction.category ? transaction.category.name : "N/A"}</p>
                
                <button onClick={() => handleEditClick(transaction)}>Editar</button>
                <button onClick={() => handleDeleteTransaction(transaction.id)}>Excluir</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionsPage;