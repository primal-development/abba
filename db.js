// db.js
require('dotenv').config();


const mariadb = require('mariadb');
const pool = mariadb.createPool({
     host: 'demez.asuscomm.com', 
     user: process.env.MARIADB_USER, 
     password: process.env.MARIADB_PW,
     connectionLimit: 5,
     database: 'training_diary'
});

// connect()
async function connect() {
    try {
        await pool.getConnection();
    } catch (err) {
        console.log(err);
    }
}

// query()
async function querydb(query) {
    try {
        return await pool.query(query);
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    connect, querydb
}