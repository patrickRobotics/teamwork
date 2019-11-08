const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();
const isProduction = process.env.NODE_ENV === 'production';

const config = {
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    max: 10, // max number of clients in the pool
    idleTimeoutMillis: 30000,
};

const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

const pool = new Pool({
    connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
    ssl: isProduction,
});


const createTables = () => {
    const employeeTable = `CREATE TABLE IF NOT EXISTS employees (
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
    pool.query(employeeTable)
        .then((res) => {
            // eslint-disable-next-line no-console
            console.log(res);
            pool.end();
        })
        .catch((err) => {
            // eslint-disable-next-line no-console
            console.log(err);
            pool.end();
        });
};

pool.on('remove', () => {
    // eslint-disable-next-line no-console
    console.log('connection closed');
});

module.exports = {
    pool,
    createTables,
};

require('make-runnable');
