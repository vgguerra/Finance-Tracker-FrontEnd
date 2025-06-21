import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CategoriesPage from './pages/CategoriesPage';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <Link to="/categorias">Ver Categorias</Link>
        </nav>
        <hr />
        <Routes>
          <Route path="/categorias" element={<CategoriesPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;