const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');

const { pool } = require('./services/db');


const app = express();
const port = process.env.PORT || '3000';

app.use(cors());

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    }),
);

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' });
});

const server = app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`App running on port ${port}.`);
});

app.get('/employees', (req, res) => {
    pool.connect((err, client, done) => {
        const query = 'SELECT id, firstName, lastName, email, gender, department, address, createdon FROM users';
        client.query(query, (error, result) => {
            done();
            if (error) {
                res.status(400).json({ error });
            }
            if (result.rows < '1') {
                res.status(404).send({
                    status: 'error',
                    error: 'No employee information found',
                });
            } else {
                res.status(200).send({
                    status: 'success',
                    data: result.rows,
                });
            }
        });
    });
});

app.post('/employees', (req, res) => {
    const data = {
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        gender: req.body.gender,
        is_admin: req.body.is_admin,
        department: req.body.department,
        address: req.body.address,
    };
    bcrypt.hash(data.password, 10, (er, hash) => {
        if (!er) {
            pool.connect((err, client, done) => {
                const query = 'INSERT INTO users(firstName, lastName, email, password, gender, is_admin, department, address) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *';
                const values = [
                    data.first_name, data.last_name, data.email,
                    hash, data.gender, data.is_admin,
                    data.department, data.address,
                ];

                client.query(query, values, (error, result) => {
                    done();
                    if (error) {
                        res.status(400)
                            .json({
                                status: 'error',
                                error,
                            });
                    } else {
                        res.status(202)
                            .send({
                                status: 'success',
                                result: result.rows[0],
                            });
                    }
                });
            });
        }
    });
});

app.get('/employees/:id', (req, res) => {
    // eslint-disable-next-line radix
    const employeeId = parseInt(req.params.id);
    pool.connect((err, client, done) => {
        const query = 'SELECT id, firstName, lastName, email, gender, department, address, createdon FROM users WHERE id = $1';
        client.query(query, [employeeId], (error, result) => {
            done();
            if (error) {
                res.status(400).json({ error });
            }
            if (result.rows < '1') {
                res.status(404).send({
                    status: 'error',
                    error: 'Employee with that id was not found',
                });
            } else {
                res.status(200).send({
                    status: 'success',
                    data: result.rows,
                });
            }
        });
    });
});

module.exports = server;
