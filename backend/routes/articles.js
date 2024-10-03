const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Route pour obtenir tous les articles
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM articles ORDER BY position ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la récupération des articles' });
    }
});


// Route pour obtenir un article par ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM articles WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Article non trouvé' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la récupération de l\'article' });
    }
});

// Route pour créer un nouvel article
router.post('/', async (req, res) => {
    const { title, content, imageUrl } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO articles (title, content, imageUrl) VALUES ($1, $2, $3) RETURNING *',
            [title, content, imageUrl]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la création de l\'article' });
    }
});

// Route pour mettre à jour un article
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, content, imageUrl } = req.body;
    try {
        const result = await pool.query(
            'UPDATE articles SET title = $1, content = $2, imageUrl = $3 WHERE id = $4 RETURNING *',
            [title, content, imageUrl, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Article non trouvé' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'article' });
    }
});

// Route pour supprimer un article
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM articles WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Article non trouvé' });
        }
        res.json({ message: 'Article supprimé avec succès' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la suppression de l\'article' });
    }
});

// Route pour obtenir tous les textes associés à un article
router.get('/:id/texts', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM articles_text WHERE id_articles = $1', [id]);
        res.json(result.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des textes:', err); // Log l'erreur
        res.status(500).json({ error: 'Erreur lors de la récupération des textes' });
    }
});

// Route pour ajouter un texte avec position
router.post('/:id/texts', async (req, res) => {
    const { id } = req.params;
    const { text, imageurl } = req.body;

    try {
        // Récupérer la position actuelle la plus élevée
        const maxPositionResult = await pool.query('SELECT MAX(position) as max_position FROM articles_text WHERE id_articles = $1', [id]);
        const newPosition = maxPositionResult.rows[0].max_position + 1 || 1;

        const result = await pool.query(
            'INSERT INTO articles_text (id_articles, text, imageurl, position) VALUES ($1, $2, $3, $4) RETURNING *',
            [id, text, imageurl, newPosition]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de l\'ajout du texte ou de l\'image' });
    }
});




// Route pour mettre à jour la position d'un article
router.put('/:id/position', async (req, res) => {
    const { id } = req.params;
    const { position } = req.body;
    try {
        const result = await pool.query(
            'UPDATE articles SET position = $1 WHERE id = $2 RETURNING *',
            [position, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour de la position de l\'article' });
    }
});



module.exports = router;
