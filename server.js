require('dotenv').config();  // Load environment variables
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Load chores.json from the file if it exists, or initialize it
let choresData;
try {
    choresData = require('./chores.json');  // Load existing chores
} catch (error) {
    choresData = null;  // If no file exists yet
}

// GET API to fetch the chores
app.get('/api/chores', (req, res) => {
    if (choresData) {
        res.json(choresData);  // Send existing chore list
    } else {
        res.status(404).send('Chore list not found');
    }
});

// POST API to update the chores (admin only)
app.post('/api/chores', (req, res) => {
    const { newChores } = req.body;

    // Check if the admin password matches the one in the environment variable
    if (req.headers['x-admin-password'] === process.env.ADMIN_PASSWORD) {
        choresData = newChores;  // Update server-side chores data

        // Save the updated chores list to chores.json
        fs.writeFileSync(path.join(__dirname, 'chores.json'), JSON.stringify(newChores, null, 2), 'utf-8');
        res.status(200).send('Chores updated successfully!');
    } else {
        res.status(403).send('Incorrect password!');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});