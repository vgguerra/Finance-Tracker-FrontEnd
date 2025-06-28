import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  createTransaction,
  getAllTransactions,
  deleteTransaction,
  updateTransaction
} from "../services/TransactionsService";
import { getAllCategories } from "../services/categoryService";

// SVG Icons
const PencilIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 20 20" style={{verticalAlign: "middle"}}>
    <path d="M14.85 2.85a2.121 2.121 0 0 1 3 3l-9.5 9.5-4 1 1-4 9.5-9.5z" stroke="#fff" strokeWidth="1.5" fill="#2563eb"/>
  </svg>
);
const TrashIcon = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 20 20" style={{verticalAlign: "middle"}}>
    <rect x="5" y="7" width="10" height="8" rx="2" stroke="#fff" strokeWidth="1.5" fill="#dc2626"/>
    <path d="M8 7V5a2 2 0 0 1 4 0v2" stroke="#fff" strokeWidth="1.5"/>
    <path d="M3 7h14" stroke="#fff" strokeWidth="1.5"/>
  </svg>
);

// Styled Components
const Container = styled.div`
  max-width: 700px;
  margin: 40px auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.08);
  padding: 32px 24px;
`;

const Title = styled.h1`
  text-align: center;
  color: #2d3748;
  margin-bottom: 32px;
`;

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 32px;
  align-items: flex-end;
`;

const Input = styled.input`
  flex: 1 1 160px;
  padding: 8px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 1rem;
`;

const Select = styled.select`
  flex: 1 1 160px;
  padding: 8px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 1rem;
`;

const Button = styled.button`
  background: ${props => props.danger ? "#dc2626" : props.secondary ? "#64748b" : "#2563eb"};
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 18px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  &:hover {
    background: ${props => props.danger ? "#b91c1c" : props.secondary ? "#334155" : "#1e40af"};
  }
  &:not(:last-child) {
    margin-right: 8px;
  }
`;

const TransactionList = styled.ul`
  list-style: none;
  padding: 0;
`;

const TransactionItem = styled.li`
  margin-bottom: 20px;
  border: 1px solid #e5e7eb;
  padding: 18px;
  border-radius: 8px;
  background: #f9fafb;
  box-shadow: 0 1px 4px rgba(0,0,0,0.03);
`;

const TransactionInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
`;

const Label = styled.span`
  font-weight: 600;
  color: #374151;
`;

const Value = styled.span`
  color: ${props => props.type === "EXPENSE" ? "#dc2626" : "#059669"};
  font-weight: 600;
`;

const ErrorMsg = styled.p`
  color: #dc2626;
  text-align: center;
`;

const LoadingMsg = styled.p`
  color: #2563eb;
  text-align: center;
`;

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
    setEditingFormData(prev => ({ ...prev, [name]: value }))
  }

  if (loading) {
    return <LoadingMsg>Carregando transações...</LoadingMsg>;
  }

  if (error) {
    return <ErrorMsg>{error}</ErrorMsg>;
  }

  return (
    <Container>
      <Title>Minhas Transações</Title>
      <Form onSubmit={handleCreateTransaction}>
        <Input
          type="text"
          placeholder="Descrição da transação"
          value={newTransactionDescription}
          onChange={(e) => setNewTransactionDescription(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Valor da transação"
          value={newTransactionValue}
          onChange={(e) => setNewTransactionValue(e.target.value)}
        />
        <Input
          type="date"
          placeholder="Data da transação"
          value={newTransactionDate}
          onChange={(e) => setNewTransactionDate(e.target.value)}
        />
        <Select
          value={newTransactionType}
          onChange={(e) => setNewTransactionType(e.target.value)}
        >
          <option value="">Tipo</option>
          <option value="EXPENSE">Despesa</option>
          <option value="INCOME">Receita</option>
        </Select>
        {categoriesLoading ? (
          <LoadingMsg>Carregando categorias...</LoadingMsg>
        ) : categoriesError ? (
          <ErrorMsg>{categoriesError}</ErrorMsg>
        ) : (
          <Select
            value={newTransactionCategory}
            onChange={(e) => setNewTransactionCategory(e.target.value)}
          >
            <option value="">Selecione uma categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        )}
        <Button type="submit">Adicionar</Button>
      </Form>
      <TransactionList>
        {transactions.map((transaction) => (
          <TransactionItem key={transaction.id}>
            {editingTransaction && editingTransaction.id === transaction.id ? (
              <Form onSubmit={handleUpdateTransaction}>
                <Input
                  name="description"
                  value={editingFormData.description}
                  onChange={handleEditFormChange}
                  placeholder="Descrição"
                />
                <Input
                  type="number"
                  name="value"
                  value={editingFormData.value}
                  onChange={handleEditFormChange}
                  placeholder="Valor"
                />
                <Input
                  type="date"
                  name="date"
                  value={editingFormData.date}
                  onChange={handleEditFormChange}
                />
                <Select name="type" value={editingFormData.type} onChange={handleEditFormChange}>
                  <option value="EXPENSE">Despesa</option>
                  <option value="INCOME">Receita</option>
                </Select>
                <Select name="categoryId" value={editingFormData.categoryId} onChange={handleEditFormChange}>
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </Select>
                <Button type="submit">Salvar</Button>
                <Button type="button" onClick={handleCancelEdit} secondary>Cancelar</Button>
              </Form>
            ) : (
              <TransactionInfo>
                <div>
                  <Label>Descrição:</Label> {transaction.description} <br />
                  <Label>Valor:</Label>{" "}
                  <Value type={transaction.type}>
                    R$ {transaction.value.toFixed(2)}
                  </Value>
                  <br />
                  <Label>Data:</Label> {new Date(transaction.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })} <br />
                  <Label>Tipo:</Label> {transaction.type === "EXPENSE" ? "Despesa" : "Receita"} <br />
                  <Label>Categoria:</Label> {transaction.category ? transaction.category.name : "N/A"}
                </div>
                <div>
                  <Button onClick={() => handleEditClick(transaction)} type="button">
                    <PencilIcon /> Editar
                  </Button>
                  <Button onClick={() => handleDeleteTransaction(transaction.id)} type="button" danger>
                    <TrashIcon /> Excluir
                  </Button>
                </div>
              </TransactionInfo>
            )}
          </TransactionItem>
        ))}
      </TransactionList>
    </Container>
  );
};

export default TransactionsPage;