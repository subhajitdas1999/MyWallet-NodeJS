const express = require('express');
const txController = require('../controllers/txController');
const authController = require('../controllers/authController');

const txRouter = express.Router();

//Only logged in user can access transactions
txRouter.use(authController.protect)
txRouter.get('/myTransaction',txController.myTransaction)
txRouter.post('/create',txController.create)

//restricted to admin
txRouter.use(authController.restrictTo('admin'))

txRouter.get('/',txController.getAllTransactions)
txRouter.get('/:id',txController.getTransaction)

module.exports = txRouter;
