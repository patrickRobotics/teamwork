const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');
const admin = require('../middleware/adminCheck');

const employeeCtrl = require('../controllers/employees');

router.post('/login', employeeCtrl.login);

router.get('/users', auth.isAuthorized, employeeCtrl.getUsers);
router.get('/users/:id', auth.isAuthorized, employeeCtrl.getUserById);

router.post('/users', auth.isAuthorized, admin.isAdmin, employeeCtrl.createUser);
router.put('/users/:id', auth.isAuthorized, admin.isAdmin, employeeCtrl.updateUser);
router.delete('/users/:id', auth.isAuthorized, admin.isAdmin, employeeCtrl.deleteUser);

module.exports = router;
