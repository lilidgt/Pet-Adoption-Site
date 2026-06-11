const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
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

//Configuração do Multer 
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../meu-projeto-react/src/photos')); // ajusta o nome da pasta do frontend se necessário
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueName + ext);
  }
});
const upload = multer({ storage });

// Rota: cadastrar pet 
app.post('/pets', upload.fields([
  { name: 'profile_photo', maxCount: 1 },
  { name: 'others_photos_videos', maxCount: 6 }
]), (req, res) => {
  const {
    name, species, age, size, city,
    state, gender, vaccine, castrated,
    description, personality, contact, fk_user
  } = req.body;

  const profile_photo = req.files['profile_photo']?.[0]?.filename || null;
  const others = req.files['others_photos_videos'] || [];
  const others_photos_videos = others.map(f => f.filename).join(',') || null;

  const sql = `
    INSERT INTO pet 
      (name, profile_photo, others_photos_videos, species, age, size, city, state, gender, vaccine, castrated, description, personality, contact, fk_user)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    name, profile_photo, others_photos_videos,
    species, age, size, city, state, gender,
    vaccine, castrated, description, personality,
    contact, fk_user
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Erro ao cadastrar pet:', err);
      return res.status(500).json({ message: 'Erro ao cadastrar pet.' });
    }
    res.json({ message: 'Pet cadastrado com sucesso!', id: result.insertId });
  });
});

app.get('/pets', (req, res) => {
  db.query('SELECT * FROM pet', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
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