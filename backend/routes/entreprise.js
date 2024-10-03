const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Route pour obtenir les informations de l'entreprise
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM entreprise');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la récupération des informations de l\'entreprise' });
    }
});

// Route pour mettre à jour les informations de l'entreprise
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, address, phone, email } = req.body;
    try {
        const result = await pool.query(
            'UPDATE entreprise SET name = $1, description = $2, address = $3, phone = $4, email = $5 WHERE id = $6 RETURNING *',
            [name, description, address, phone, email, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Entreprise non trouvée' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la mise à jour des informations de l\'entreprise' });
    }
});

module.exports = router;
