const pg = require('pg');

const config = {
    user: 'app_user',
    database: 'teamwork_db',
    password: 'P@ssw0rd',
    port: 5432,
    max: 10, // max number of clients in the pool
    idleTimeoutMillis: 30000,
};

const pool = new pg.Pool(config);

pool.on('connect', () => {
  console.log('connected to the Database');
});

const createTables = () => {
    const schoolTable = `CREATE TABLE IF NOT EXISTS employees (
        id SERIAL PRIMARY KEY,
        firstName VARCHAR(255) NOT NULL,
        lastName VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        gender VARCHAR(20) NOT NULL,
        jobRole VARCHAR(50) NOT NULL,
        department VARCHAR(50) NULL,
        address VARCHAR(255) NULL,
        createdOn TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )`;
    pool.query(schoolTable)
    .then((res) => {
        console.log(res);
        pool.end();
    })
    .catch((err) => {
        console.log(err);
        pool.end();
    });
};

pool.on('remove', () => {
    console.log('client removed');
    process.exit(0);
});

module.exports = { 
    pool,
    createTables,
  };
  
require('make-runnable');