import React, { useEffect, useState } from "react";
import { createTransaction, getAllTransactions } from "../services/TransactionsService";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    const [newTransactionDescription, setNewTransactionDescription] = useState('');
    const [newTransactionValue, setNewTransactionValue] = useState('');

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

  useEffect(() => {
    fetchTransactions();
  }, []);

    const handleCreateTransaction = async (e) => {
      e.preventDefault();
      if (!newTransactionDescription.trim() || !newTransactionValue) {
          alert('Todos os campos devem estar preenchidos.');
          return;
      }
      try {
        await createTransaction({ description: newTransactionDescription,value: newTransactionValue });
        alert('Transação criada com sucesso!');
        setNewTransactionDescription(''); 
        setNewTransactionValue('');
        fetchTransactions();    
      } catch (err) {
        setError('Erro ao criar a Transação.');
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
      <ul>
        {transactions.map((transaction) => (
          <li key={transaction.id} style={{ marginBottom: '10px', border: '1px solid #ccc', padding: '8px', borderRadius: '4px' }}>
            <p><strong>Descrição:</strong> {transaction.description}</p>
            <p><strong>Valor:</strong> R$ {transaction.value.toFixed(2)}</p>
            <p><strong>Data:</strong> {transaction.date}</p>
            <p><strong>Tipo:</strong> {transaction.type === 'EXPENSE' ? 'Despesa' : 'Receita'}</p>
            <p><strong>Categoria:</strong> {transaction.category ? transaction.category.name : 'N/A'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionsPage;