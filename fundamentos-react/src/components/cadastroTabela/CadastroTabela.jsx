import React, { useState } from 'react';

const CadastroTabela = () => {
    const [id, setId] = useState(1);
    const [nome, setNome] = useState('');
    const [preco, setPreco] = useState('');
    const [produtos, setProdutos] = useState([]);

    const adicionarProduto = () => {
        const novoProduto = { id, nome, preco: parseFloat(preco) };
        setProdutos([...produtos, novoProduto]);
        setId(id + 1);
        setNome('');
        setPreco('');
    };

    return (
        <div>
            <h2>Cadastro de Produtos</h2>
            <div>
                <label>Nome: </label>
                <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                />
            </div>
            <div>
                <label>Preço: </label>
                <input
                    type="number"
                    value={preco}
                    onChange={(e) => setPreco(e.target.value)}
                />
            </div>
            <button onClick={adicionarProduto}>Adicionar Produto</button>
            <h2>Lista de Produtos</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Preço</th>
                    </tr>
                </thead>
                <tbody>
                    {produtos.map((produto) => (
                        <tr key={produto.id}>
                            <td>{produto.id}</td>
                            <td>{produto.nome}</td>
                            <td>R$ {produto.preco.toFixed(2).replace('.', ',')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CadastroTabela;