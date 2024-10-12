const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // To parse incoming JSON requests
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

let choresData = require('./chores.json'); // Load the current chores from a file

// GET API to fetch the chores
app.get('/api/chores', (req, res) => {
    res.json(choresData);
});

// POST API to update the chores (admin only)
app.post('/api/chores', (req, res) => {
    const { password, newChores } = req.body;

    if (password === 'admin!') {
        choresData = newChores;

        // Save the updated chores list to a JSON file
        fs.writeFileSync('./chores.json', JSON.stringify(newChores, null, 2), 'utf-8');
        res.status(200).send('Chores updated successfully!');
    } else {
        res.status(403).send('Incorrect password!');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
