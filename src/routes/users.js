const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');

const employeeCtrl = require('../controllers/employees');

router.get('/users', auth, employeeCtrl.getUsers);
router.get('/users/:id', auth, employeeCtrl.getUserById);
router.post('/users', auth, employeeCtrl.createUser);
router.put('/users/:id', auth, employeeCtrl.updateUser);
router.delete('/users/:id', auth, employeeCtrl.deleteUser);
router.post('/login', employeeCtrl.login);

module.exports = router;
