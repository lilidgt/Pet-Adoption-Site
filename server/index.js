const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt'); // Para segurança das senhas
const jwt = require('jsonwebtoken'); // Para geração de tokens
const multer = require('multer'); // IMPORT CORRIGIDO
const path = require('path'); // IMPORT CORRIGIDO
const fs = require('fs'); // Importado para garantir a criação da pasta de fotos
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// --- MIDDLEWARE DE AUTENTICAÇÃO JWT (Movido para cima para evitar o erro de inicialização) ---
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ error: "Acesso negado. Token não fornecido." });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: "Acesso negado. Token mal formatado." });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_123');
        req.user = verified; 
        next(); 
    } catch (err) {
        res.status(403).json({ error: "Token inválido ou expirado." });
    }
};

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Configuração Segura do Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Monta o caminho absoluto para evitar erros de diretório do Node
    const targetPath = path.resolve(__dirname, '..', 'meu-projeto-react', 'src', 'assets', 'photos');
    
    // Se a pasta não existir por algum motivo, cria ela de forma síncrona
    if (!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath, { recursive: true });
    }
    cb(null, targetPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueName + ext);
  }
});
const upload = multer({ storage });

// --- ROTA: CADASTRAR PET ---
app.post('/pets', upload.fields([
  { name: 'profile_photo', maxCount: 1 },
  { name: 'others_photos_videos', maxCount: 6 }
]), (req, res) => {
  const {
    name, species, age, size, city,
    state, gender, vaccine, castrated,
    description, personality, contact, fk_user
  } = req.body;

  const filesReceived = req.files || {};
  const profile_photo = filesReceived['profile_photo']?.[0]?.filename || null;
  const others = filesReceived['others_photos_videos'] || [];
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

// --- ROTA: ATUALIZAR PET (Protegida) ---
app.put('/pets/:id', verifyToken, upload.fields([
  { name: 'profile_photo', maxCount: 1 },
  { name: 'others_photos_videos', maxCount: 6 }
]), (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const {
    name, species, age, size, city,
    state, gender, vaccine, castrated,
    description, personality, contact
  } = req.body;

  // Primeiro verificamos se o pet pertence ao usuário
  const checkSql = "SELECT fk_user FROM pet WHERE id_pet = ?";
  db.query(checkSql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Erro ao verificar proprietário." });
    if (results.length === 0) return res.status(404).json({ error: "Pet não encontrado." });
    
    if (results[0].fk_user !== userId) {
      return res.status(403).json({ error: "Você não tem permissão para editar este pet." });
    }

    let sql = `
      UPDATE pet SET 
        name=?, species=?, age=?, size=?, city=?, 
        state=?, gender=?, vaccine=?, castrated=?, 
        description=?, personality=?, contact=?
    `;
    const values = [
      name, species, age, size, city, 
      state, gender, vaccine, castrated, 
      description, personality, contact
    ];

    if (req.files && req.files['profile_photo']) {
      sql += `, profile_photo=?`;
      values.push(req.files['profile_photo'][0].filename);
    }

    if (req.files && req.files['others_photos_videos']) {
      const others = req.files['others_photos_videos'];
      const others_photos_videos = others.map(f => f.filename).join(',');
      sql += `, others_photos_videos=?`;
      values.push(others_photos_videos);
    }

    sql += ` WHERE id_pet=?`;
    values.push(id);

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('Erro ao atualizar pet:', err);
        return res.status(500).json({ message: 'Erro ao atualizar pet.' });
      }
      res.json({ message: 'Pet updated successfully!' });
    });
  });
});

app.get('/pets', (req, res) => {
    const sql = `
        SELECT p.*, u.username AS nome_dono
        FROM pet p
        INNER JOIN user u ON p.fk_user = u.id_user
    `; 

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar todos os pets:', err.message);
            return res.status(500).json({ error: "Erro interno no servidor." });
        }

        if (results.length === 0) {
            return res.json([]);
        }

        res.json(results);
    });
});

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

app.delete('/pets/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  // Primeiro verificamos se o pet pertence ao usuário
  const checkSql = "SELECT fk_user FROM pet WHERE id_pet = ?";
  db.query(checkSql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Erro ao verificar proprietário." });
    if (results.length === 0) return res.status(404).json({ error: "Pet não encontrado." });
    
    if (results[0].fk_user !== userId) {
      return res.status(403).json({ error: "Você não tem permissão para excluir este pet." });
    }

    // Primeiro removemos dos favoritos para evitar erro de chave estrangeira
    const sqlDeleteFavorites = "DELETE FROM minha_casinha WHERE fk_pet_id = ?";

    db.query(sqlDeleteFavorites, [id], (err) => {
      if (err) {
        console.error('Erro ao excluir favoritos do pet:', err);
        return res.status(500).json({ message: 'Erro ao excluir pet (favoritos).' });
      }

      const sqlDeletePet = "DELETE FROM pet WHERE id_pet = ?";
      db.query(sqlDeletePet, [id], (err, result) => {
        if (err) {
          console.error('Erro ao excluir pet:', err);
          return res.status(500).json({ message: 'Erro ao excluir pet.' });
        }
        res.json({ message: 'Pet excluído com sucesso!' });
      });
    });
  });
});

app.post('/signup', async (req, res) => {
    const { username, email, password, isAdotante, isDoador } = req.body;

    let user_type = 'Adotante'; 
    if (isAdotante && isDoador) {
        user_type = 'Adotante e Doador';
    } else if (isDoador) {
        user_type = 'Doador';
    } else if (isAdotante) {
        user_type = 'Adotante';
    }

    try {
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

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM user WHERE login = ?";
    
    db.query(sql, [email], async (err, results) => {
        if (err) return res.status(500).json({ error: "Erro no servidor." });
        
        if (results.length === 0) {
            return res.status(401).json({ error: "Usuário não encontrado." });
        }

        const user = results[0];
        const match = await bcrypt.compare(password, user.password);

        if (match) {
            // Gera o token JWT baseado no login efetuado com sucesso
            const token = jwt.sign(
            { id: user.id_user, username: user.username, type: user.user_type },
            process.env.JWT_SECRET || 'fallback_secret_key_123',
            { expiresIn: '7d' } // <--- MUDE DE '1h' PARA '7d'
        );

            res.json({ 
                message: "Login realizado!", 
                token: token,
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


app.post('/favoritos/toggle', verifyToken, (req, res) => {
    const id_user = req.user.id;
    const { id_pet } = req.body;

    if (!id_pet) {
        return res.status(400).json({ error: "O ID do Pet é obrigatório." });
    }

    const checkSql = "SELECT * FROM minha_casinha WHERE fk_user_id = ? AND fk_pet_id = ?";
    
    db.query(checkSql, [id_user, id_pet], (err, results) => {
        if (err) return res.status(500).json({ error: "Erro ao verificar favoritos." });

        if (results.length > 0) {
            const deleteSql = "DELETE FROM minha_casinha WHERE fk_user_id = ? AND fk_pet_id = ?";
            db.query(deleteSql, [id_user, id_pet], (err) => {
                if (err) return res.status(500).json({ error: "Erro ao remover dos favoritos." });
                return res.json({ isFavorited: false, message: "Removido da minha casinha!" });
            });
        } else {
            const insertSql = "INSERT INTO minha_casinha (fk_user_id, fk_pet_id) VALUES (?, ?)";
            db.query(insertSql, [id_user, id_pet], (err) => {
                if (err) return res.status(500).json({ error: "Erro ao adicionar aos favoritos." });
                return res.json({ isFavorited: true, message: "Adicionado à minha casinha!" });
            });
        }
    });
});

app.get('/favoritos/check', verifyToken, (req, res) => {
    const id_user = req.user.id;
    const { id_pet } = req.query;

    const sql = "SELECT * FROM minha_casinha WHERE fk_user_id = ? AND fk_pet_id = ?";
    db.query(sql, [id_user, id_pet], (err, results) => {
        if (err) return res.status(500).json({ error: "Erro ao checar status de favorito." });
        res.json({ isFavorited: results.length > 0 });
    });
});

app.get('/favoritos/:id_user', verifyToken, (req, res) => {
    const { id_user } = req.params;
    
    console.log("-> Recebida requisição de favoritos para o id_user:", id_user);

    const sql = `
        SELECT p.*, u.username AS nome_dono
        FROM pet p
        INNER JOIN minha_casinha mc ON p.id_pet = mc.fk_pet_id
        INNER JOIN user u ON p.fk_user = u.id_user
        WHERE mc.fk_user_id = ?
    `;

    db.query(sql, [id_user], (err, results) => {
        if (err) {
            console.error('--- ERRO REAL DO MYSQL ---');
            console.error(err.message);
            console.error('--------------------------');
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

const BACKEND_PORT = 3001;
app.listen(BACKEND_PORT, () => {
    console.log(`Servidor backend rodando na porta ${BACKEND_PORT}`);
});