const Pool = require('pg').Pool;

module.exports = new Pool({
    user: 'postgres',
    host: 'localhost',
    password: 'postgres',
    port: 5432,
    database: 'cred'
})