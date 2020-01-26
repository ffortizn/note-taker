// Dependencies
// =============================================================
const express = require('express');
var path = require('path');
const fs = require('fs');


// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// data
// =============================================================
// const data = [{ title: 'Test Title', text: 'Test text', id: 0 }];
const data = [];

// Routes
// =============================================================

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// GET * - Should return the index.html file  
// app.get("/*", function (req, res) {
//     res.sendFile(path.join(__dirname, 'public/index.html'));
// });

// GET /notes - Should return the notes.html file.
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

// GET /api/notes - Should read the db.json file and return all saved notes as JSON.
app.get("/api/notes", function (req, res) {
    fs.readFile('./db/db.json', function (err, res) {
        if (err) throw err;
        data.length = 0;

        console.info("----------");
        var arrNotes = JSON.parse(res);
        arrNotes.forEach(element => {
            data.push(element);
            console.info("get::element: " + JSON.stringify(element));
        })

    });
    // console.info(data);
    return res.json(data);
});

// POST /api/notes - Should recieve a new note to save on the request body,
//  add it to the db.json file, and then return the new note to the client.
app.post("/api/notes", function (req, res) {
    var newNote = req.body;
    newNote.id = data.length + 1;
    data.push(newNote);
    fs.writeFile('./db/db.json', JSON.stringify(data), function (err) {
        if (err) throw err;
    });
    return res.json(data);
});

// DELETE /api/notes/:id - Should recieve a query paramter containing the id of a note to delete.
// This means you'll need to find a way to give each note a unique id when it's saved.
// In order to delete a note, you'll need to read all notes from the db.json file,
// remove the note with the given id property, and then rewrite the notes to the db.json file.
app.delete("api/notes/:id", function (req, res) {
    console.info(data);
    return res.json(data);
});


// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});