const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt'); // Para segurança das senhas
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// --- ROTA DE SIGN UP (CADASTRO) ---
app.post('/signup', async (req, res) => {
    const { username, email, password, isAdotante, isDoador } = req.body;

    // Lógica para definir o user_type baseado nos checkboxes do frontend
    let user_type = 'Adotante'; // Default
    if (isAdotante && isDoador) {
        user_type = 'Adotante e Doador';
    } else if (isDoador) {
        user_type = 'Doador';
    } else if (isAdotante) {
        user_type = 'Adotante';
    }

    try {
        // Criptografando a senha (requer varchar(255) no banco)
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = "INSERT INTO user (username, login, password, user_type) VALUES (?, ?, ?, ?)";
        
        db.query(sql, [username, email, hashedPassword, user_type], (err, result) => {
            if (err) {
                console.error('Erro no banco:', err);
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ error: "Este e-mail já está cadastrado." });
                }
                return res.status(500).json({ error: "Erro ao cadastrar no banco de dados." });
            }
            res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
        });
    } catch (error) {
        res.status(500).json({ error: "Erro interno no servidor." });
    }
});

// --- ROTA DE LOGIN ---
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM user WHERE login = ?";
    
    db.query(sql, [email], async (err, results) => {
        if (err) return res.status(500).json({ error: "Erro no servidor." });
        
        if (results.length === 0) {
            return res.status(401).json({ error: "Usuário não encontrado." });
        }

        const user = results[0];

        // Compara a senha digitada com o hash do banco
        const match = await bcrypt.compare(password, user.password);

        if (match) {
            res.json({ 
                message: "Login realizado!", 
                user: { 
                    id: user.id_user, 
                    username: user.username,
                    type: user.user_type 
                } 
            });
        } else {
            res.status(401).json({ error: "Senha incorreta." });
        }
    });
});

// Rota para detalhes do pet (já existente)
app.get('/pets/:id', (req, res) => {
    const { id } = req.params; 
    const sql = `
        SELECT p.*, u.username AS nome_dono
        FROM pet p
        INNER JOIN user u ON p.fk_user = u.id_user
        WHERE p.id_pet = ?
    `; 

    db.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ error: "Erro interno." });
        if (results.length === 0) return res.status(404).json({ error: "Pet não encontrado." });
        res.json(results[0]);
    });
});

const BACKEND_PORT = 3001;
app.listen(BACKEND_PORT, () => {
    console.log(`Servidor backend rodando na porta ${BACKEND_PORT}`);
});