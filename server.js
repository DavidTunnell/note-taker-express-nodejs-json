// imports
const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid');

//initialize express and default port
const app = express();
const PORT = 3001;
const dbFileLocation = "./db/db.json";

//middleware for parsing JSON and URL encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// make public (client) folder available to users
app.use(express.static('public'));

// also provide specific paths
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

//Read/GET - API pulls from ./db/db.json
app.get('/api/notes', (req, res) => {
    let rawData = fs.readFileSync(dbFileLocation);
    return res.json(JSON.parse(rawData));
});

// Create/POST request to add a notes object
app.post('/api/notes', (req, res) => {
    // get values from request body
    const requestBody = req.body;
    //generate a guid and add it to object before saving
    requestBody.id = uuid();
    //save
    writeToDbJson(dbFileLocation, requestBody);
    //return id that was generated
    res.json({ id: requestBody.id });
})

//Update/PUT

//Delete

//appends to db/json file and saves it
const writeToDbJson = (dbFileLocation, newEntry) => {
    fs.readFile(dbFileLocation, function(err, data) {
        var json = JSON.parse(data);
        json.push(newEntry);
        fs.writeFile(dbFileLocation, JSON.stringify(json), function(err) {
            if (err) throw err;
            console.log('The "data to append" was appended to file!');
        });
    })
}

//listen when running
app.listen(PORT, () =>
    console.log(`Express server listening on port ${PORT}!`)
);