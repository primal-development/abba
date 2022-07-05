// main.js

const db = require('./db');
const server = require('./server');


async function start() {
    try {
        await db.connect();
        console.log('Connected to database');
        await server.startserver();
    } catch (err) {
        console.log(err);
    }
}

start();