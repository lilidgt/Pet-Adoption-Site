const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Permite que o seu React (que roda em outra porta) acesse essa API
app.use(cors());
app.use(express.json());

// Configuração da conexão com a Hostinger
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Testando a conexão com o banco ao iniciar
db.getConnection((err, connection) => {
    if (err) {
        console.error('Erro ao conectar no banco da Hostinger:', err.message);
        console.log('Dica: Verifique se você liberou o IP do seu computador no painel da Hostinger (MySQL Remoto).');
    } else {
        console.log('Conexão com o MySQL da Hostinger realizada com sucesso!');
        connection.release(); // Libera a conexão de volta para o pool
    }
});

// Sua primeira rota de teste (Exemplo: Buscar pets)
app.get('/api/pets', (req, res) => {
    const sql = "SELECT * FROM pet";
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor backend rodando na porta ${PORT}`);
});