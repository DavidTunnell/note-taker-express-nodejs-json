// imports
const express = require('express');
const path = require('path');
const fs = require('fs');

//initialize express and default port
const app = express();
const PORT = 3001;

//middleware for parsing JSON and URL encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// make public (client) folder available to users
app.use(express.static('public'));

// also provide specific paths
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

//API pulls from ./db/db.json
app.get('/api/notes', (req, res) => {
    let rawData = fs.readFileSync('./db/db.json');
    return res.json(JSON.parse(rawData));
});

app.listen(PORT, () =>
    console.log(`Express server listening on port ${PORT}!`)
);