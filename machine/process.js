const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const SERVER_PORT = 3001;

app.use(bodyParser.json());

let memory = 62;

function updateMemory(value) {
    memory += value;
}

app.get('/memory', (req, res) => {
    res.json({ memory });
});

app.post('/memory', (req, res) => {
    const { value } = req.body;
    updateMemory(value);
    if (memory <= 0 || memory > 62) {
        res.sendStatus(405);
        console.log(`Memory ${memory} is not available.`)
        updateMemory(-value);
        console.log(`Memory status: ${memory}`);
    } else {
        console.log(`Memory status: ${memory}`);
        res.sendStatus(200);
    }
});

app.listen(SERVER_PORT, () => {
    console.log(`Process service listening at http://localhost:${SERVER_PORT}`);
});
