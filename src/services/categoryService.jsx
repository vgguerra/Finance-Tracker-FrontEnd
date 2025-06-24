import apiClient from './api';

export const getAllCategories = () => {
  return apiClient.get('/categories');
};

export const createCategory = (categoryData) => {
  return apiClient.post('/categories', categoryData);
};

export const updateCategory = (categoryId, categoryData) => {
    return apiClient.put(`/categories/${categoryId}`, categoryData)
};

export const deleteCategory = (categoryId) => {
    return apiClient.delete(`/categories/${categoryId}`);
};