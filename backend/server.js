require('dotenv').config();
const express = require('express');
const cors = require('cors');
const articleRoutes = require('./routes/articles');
const textRoutes = require('./routes/articles_text');
const entrepriseRoutes = require('./routes/entreprise');
const loginRoutes = require('./routes/login');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

app.use(cors());
app.use(express.json());

// Routes
app.use('/articles', articleRoutes);
app.use('/articles_text', textRoutes);
app.use('/entreprise', entrepriseRoutes);
app.use('/login', loginRoutes);

// Démarrer le serveur
app.listen(PORT, HOST,() => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});
