const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../services/db');

exports.createUser = (req, res, next) => {
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
                        res.status(400).json({
                            status: 'error',
                            error: 'An error occurred with your query',
                        });
                    } else {
                        const token = jwt.sign({ id: result.rows[0].id }, process.env.TOKEN_SECRET, {
                            expiresIn: 86400 // expires in 24 hours
                        });
                        Object.assign(result.rows[0], { token: token });
                        res.status(202).send({
                            status: 'success',
                            result: result.rows[0],
                        });
                    }
                });
            });
        }
    });
};

exports.getUsers = (req, res, next) => {
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
};

exports.getUserById = (req, res, next) => {
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
};

exports.updateUser = (req, res, next) => {
    // eslint-disable-next-line radix
    const employeeId = parseInt(req.params.id);
    const data = {
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        email: req.body.email,
        gender: req.body.gender,
        is_admin: req.body.is_admin,
        department: req.body.department,
        address: req.body.address,
    };
    pool.connect((err, client, done) => {
        client.query(
            'UPDATE users SET firstName=$2, lastName=$3, email=$4, gender=$5, is_admin=$6, department=$7, address=$8 WHERE id = $1',
            [employeeId, data.first_name, data.last_name, data.email, data.gender, data.is_admin, data.department, data.address],
            (error, result) => {
                done();
                if (error) {
                    res.status(400).json({
                        status: 'error',
                        error: 'An error occurred with your query',
                    });
                } else {
                    res.status(202).send({
                        status: 'success',
                    });
                }
            }
        );
    });
};

exports.deleteUser = (req, res, next) => {
    // eslint-disable-next-line radix
    const employeeId = parseInt(req.params.id);
    pool.connect((er, client, done) => {
        const query = 'DELETE from users WHERE id = $1';
        client.query(query, [employeeId], (error, result) => {
            done();
            if (error) {
                res.status(400).json({ error });
            } else {
                res.status(200).send({
                    status: 'success',
                });
            }
        });
    });
};
