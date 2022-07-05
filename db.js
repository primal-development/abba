// db.js
require('dotenv').config();


const mariadb = require('mariadb');
const pool = mariadb.createPool({
     host: 'demez.asuscomm.com', 
     user:'silo', 
     password: process.env.MARIADB_PW,
     connectionLimit: 5
});

// connect()
async function connect() {
    try {
        await pool.getConnection();
        // select default db
        await pool.query('USE training_diary');
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