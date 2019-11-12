const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');

const employeeCtrl = require('../controllers/employees');

router.get('/users', auth.isAuthorized, employeeCtrl.getUsers);
router.get('/users/:id', auth.isAuthorized, employeeCtrl.getUserById);

router.post('/users', auth.isAuthorized, employeeCtrl.createUser);
router.put('/users/:id', auth.isAuthorized, employeeCtrl.updateUser);
router.delete('/users/:id', auth.isAuthorized, employeeCtrl.deleteUser);

router.post('/login', employeeCtrl.login);

module.exports = router;
