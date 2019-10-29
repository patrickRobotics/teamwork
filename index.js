const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const {pool} = require('./services/db');
const app = express();
const port = process.env.PORT || '3000'

app.use(cors());

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' });
});
app.listen(port, () => {
    console.log(`App running on port ${port}.`)
});


app.get('/employees', (req, res) => {
    pool.connect((err, client, done) => {
        const query = 'SELECT * FROM employees';
        client.query(query, (error, result) => {
            done();
            if (error) {
                res.status(400).json({error})
            } 
            if(result.rows < '1') {
                res.status(404).send({
                    status: 'Failed',
                    message: 'No employee information found',
                });
            } else {
                res.status(200).send({
                    status: 'Successful',
                    message: 'Employees Information retrieved',
                    employees: result.rows,
                });
            }
        });
    });
});


app.post('/employees', (req, res) => {
    const data = {
        first_name : req.body.firstName,
        last_name : req.body.lastName,
        email : req.body.email,
        password : req.body.password,
        gender : req.body.gender,
        job_role : req.body.jobRole,
        department : req.body.department,
        address : req.body.address,
    }
  
    pool.connect((err, client, done) => {
        const query = 'INSERT INTO employees(firstName, lastName, email, password, gender, jobRole, department, address) VALUES($1,$2,$3,$4,$5,$6,$7,$8,) RETURNING *';
        const values = [data.first_name, data.last_name, data.email, data.password, data.gender, data.job_role, data.department, data.address];
  
        client.query(query, values, (error, result) => {
            done();
            if (error) {
                res.status(400).json({error});
            }
            else {
                res.status(202).send({
                    status: 'Successful',
                    result: result.rows[0],
                });
            }
        });
    });
});
    