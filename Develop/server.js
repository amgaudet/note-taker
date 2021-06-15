const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')));
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, './public/notes.html')));
app.get('/api/notes', (req, res) => res.sendFile(path.join(__dirname, './db/db.json')));

app.post('/api/notes', (req, res) => {
    const body = {...req.body};
    //assigns current note db to notes
    const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'));

    //rewrites db.json file with current entries concatted with saved note
    fs.writeFileSync('./db/db.json', JSON.stringify(notes.concat(req.body)), 'utf-8');
    res.send(body);

})

app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`);
});