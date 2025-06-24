import apiClient from "./api";

export const getAllTransactions = () =>{
    return apiClient.get('/transactions')
}

export const createTransaction = (transactionData) => {
  return apiClient.post('/transactions', transactionData);
};

export const updateTransaction = (transactionId, transactionData) => {
    return apiClient.put(`/transactions/${transactionId}`, transactionData)
};

export const deleteTransaction = (transactionId) => {
    return apiClient.delete(`/transactions/${transactionId}`);
};