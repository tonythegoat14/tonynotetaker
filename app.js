const express = require('express');
const path = require('path');
const fs = require('fs');
const noteJSON = require('./db/db.json');
const PORT = 8080;

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('./'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    res.json(noteJSON);
});

app.post('/api/notes', (req, res) => {
    const lastId = noteJSON.length ? Math.max(...(noteJSON.map(note => note.id))) : 0;
    const id = lastId + 1;
    noteJSON.push({ id, ...req.body });
    res.json(noteJSON.slice(-1));
});

app.delete('/api/notes/:id', (req, res) => {
    let note = noteJSON.find(({ id }) => id === JSON.parse(req.params.id));
    noteJSON.splice(noteJSON.indexOf(note), 1);
    res.end("Note deleted");
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));