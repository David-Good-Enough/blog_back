const express = require('express');
const router = express.Router();
const pool = require('../config/db');


// Route pour modifier un texte
router.put('/:textId', async (req, res) => {
    const { textId } = req.params;
    const { text } = req.body;
    try {
        const result = await pool.query(
            'UPDATE articles_text SET text = $1 WHERE id = $2 RETURNING *',
            [text, textId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Texte non trouvé' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour du texte' });
    }
});

// Route pour supprimer un texte
router.delete('/:textId', async (req, res) => {
    const { textId } = req.params;
    try {
        const result = await pool.query('DELETE FROM articles_text WHERE id = $1 RETURNING *', [textId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Texte non trouvé' });
        }
        res.json({ message: 'Texte supprimé avec succès' });
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la suppression du texte' });
    }
});

// Route pour mettre à jour la position d'un text ou image
router.put('/:textId/position', async (req, res) => {
    const { textId } = req.params;
    const { position } = req.body;
    
    try {
        await pool.query('UPDATE articles_text SET position = $1 WHERE id = $2', [position, textId]);
        res.status(200).json({ message: 'Position mise à jour' });
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour de la position' });
    }
});




module.exports = router;
