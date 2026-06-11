const express = require('express');
const router = express.Router();
const upload = require('./multerConfig');
const db = require('./db');

router.post('/pets', upload.fields([
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

module.exports = router;