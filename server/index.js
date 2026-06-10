const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares para permitir o acesso do React e leitura de JSON
app.use(cors());
app.use(express.json());

// Configuração do Pool de Conexão com a Hostinger
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Rota dinâmica para buscar detalhes de um pet específico pelo ID
app.get('/pets/:id', (req, res) => {
    const { id } = req.params; 
    
    const sql = `
        SELECT p.*, u.username AS nome_dono
        FROM pet p
        INNER JOIN user u ON p.fk_user = u.id_user
        WHERE p.id_pet = ?
    `; 

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar detalhes do pet e usuário:', err.message);
            return res.status(500).json({ error: "Erro interno no servidor." });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Pet não encontrado." });
        }

        // Devolve o objeto do pet mesclado com os dados do usuário para o React
        res.json(results[0]);
    });
});
// Alterado o nome da variavel para evitar que o .env force a porta 3306 do MySQL
const BACKEND_PORT = 3001;
app.listen(BACKEND_PORT, () => {
    console.log(`Servidor backend rodando na porta ${BACKEND_PORT}`);
    console.log('Aguardando requisicoes do React...');
});