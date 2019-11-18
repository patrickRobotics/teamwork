const { Pool } = require('pg');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

dotenv.config();
const isProduction = process.env.NODE_ENV === 'production';

const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

const pool = new Pool({
    connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
    ssl: isProduction,
});

const createTables = () => {
    const teamworkDb = `
        CREATE TABLE IF NOT EXISTS users (
            Id SERIAL PRIMARY KEY,
            firstName VARCHAR(255) NOT NULL,
            lastName VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            gender VARCHAR(20) NOT NULL,
            is_admin BOOLEAN NOT NULL,
            department VARCHAR(50) NULL,
            address VARCHAR(255) NULL,
            createdOn TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS category (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description VARCHAR(255) NOT NULL,
            createdOn TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS posts (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            article VARCHAR(255) NOT NULL,
            authorId INTEGER REFERENCES users(id),
            flagged BOOLEAN NULL,
            createdOn TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS gifs (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            imageUrl VARCHAR(255) NOT NULL,
            publicId VARCHAR(255) NOT NULL,
            authorId INTEGER REFERENCES users(Id),
            flagged BOOLEAN NULL,
            createdOn TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS comments (
            id SERIAL PRIMARY KEY,
            comment VARCHAR(255) NOT NULL,
            postId INTEGER REFERENCES posts(id) NULL,
            gifId INTEGER REFERENCES gifs(id) NULL,
            authorId INTEGER REFERENCES users(id),
            createdOn TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )`;
    pool.query(teamworkDb)
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

const createAdminUSer = () => {
    bcrypt.hash(process.env.ADMIN_PASSWORD, 10, (error, hash) => {
        if (!error) {
            const adminUser = 'INSERT INTO users(firstName, lastName, email, password, gender, is_admin) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
            const adminUserValues = ['Brian', 'Carlson', 'brian.carlson@gmail.com', hash, 'm', true];
            pool.query(adminUser, adminUserValues)
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
        }
    });
};

pool.on('remove', () => {
    // eslint-disable-next-line no-console
    console.log('connection closed');
});

module.exports = {
    pool,
    createTables,
    createAdminUSer,
};

require('make-runnable');
