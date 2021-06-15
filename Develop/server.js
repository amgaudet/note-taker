const express = require('express');
const app = express();
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(express.static('public'));

app.get('/*', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')));
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, './public/notes.html')));
app.get('/api/notes', (req, res) => res.sendFile(path.join(__dirname, './db/db.json')));

app.post('/api/notes', (req, res) => {
    const body = {...req.body};
    //adds id key with uuid
    body.id = uuidv4();
    //assigns current note db to notes
    const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'));

    //rewrites db.json file with current entries concatted with saved note
    fs.writeFileSync('./db/db.json', JSON.stringify(notes.concat(body)), 'utf-8');
    res.send(body);

});

app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    let notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'));
    //filters out object with matching id
    notes = notes.filter(note => note.id !== id);

    //rewrites db.json after filter
    fs.writeFileSync('./db/db.json', JSON.stringify(notes), 'utf-8');
    res.send(notes);
});

app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`);
});