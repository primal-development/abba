//  server.js

const express = require('express');
const app = express();
const db = require('./db');

const port = process.env.PORT || 3000;

async function startserver(){
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
}

app.get('/api', async (req, res) => {
    let re = await db.querydb('SELECT * FROM Activity');
    res.send(re);
    console.log(re);
});

module.exports = {
    startserver
}