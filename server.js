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

// also provide specific paths to notes
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

//Delete
app.delete("/api/notes/:id", function(req, res) {
    //get the id being passed in
    const id = req.params.id;
    //if it exists delete else throw error
    deleteFromDbJson(dbFileLocation, id);
    //return id of deleted record;
    res.json({ id: id });
});


//appends to db/json file and saves it - https://stackoverflow.com/questions/36093042/how-do-i-add-to-an-existing-json-file-in-node-js
const writeToDbJson = (dbFileLocation, newEntry) => {
    fs.readFile(dbFileLocation, function(err, data) {
        var json = JSON.parse(data);
        json.push(newEntry);
        fs.writeFile(dbFileLocation, JSON.stringify(json), function(err) {
            if (err) throw err;
            console.log('Notes were appended to ' + dbFileLocation + '!');
        });
    })
}

//find and removes record by id and then saves
const deleteFromDbJson = (dbFileLocation, idPassed) => {
    fs.readFile(dbFileLocation, function(err, data) {
        var json = JSON.parse(data);
        const filteredArray = json.filter(({ id }) => id !== idPassed)
        fs.writeFile(dbFileLocation, JSON.stringify(filteredArray), function(err) {
            if (err) throw err;
            console.log('Notes were appended to ' + dbFileLocation + '!');
        });
    })
}

//listen when running
app.listen(PORT, () =>
    console.log(`Express server listening on port ${PORT}!`)
);