import axios from "axios";
import React, { useState } from "react";


function CriarCategoria() {
  const [nomeCategoria, setNomeCategoria] = useState("");

  const handleCadastrarCategoria = async () => {
    const dataCategory = {
      name: nomeCategoria,
    };

    const resp = await axios.post(
      "http://localhost:8081/api/categories",
      dataCategory
    );

    try {
      if (resp.status === 201) {
        alert("Categoria criada com sucesso!");
        setNomeCategoria(""); // Limpa o campo de entrada
      } else {
        alert("Erro ao criar categoria.");
      }
    } catch (error) {
      console.error("Erro ao criar categoria:", error);
      alert("Erro ao criar categoria. Tente novamente.");
    }
  };
  return (
    <div>
      <h1>Criar Categoria</h1>

      <input
        type="text"
        placeholder="Nome da Categoria"
        className="input"
        value={nomeCategoria}
        onChange={(e) => setNomeCategoria(e.target.value)}
      />
      <button onClick={handleCadastrarCategoria}>Cadastrar</button>
    </div>
  );
}

export default CriarCategoria;
