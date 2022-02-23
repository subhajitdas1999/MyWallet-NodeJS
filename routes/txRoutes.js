import express from 'express';
import { createTx,myTransaction,getAllTransactions,getTransaction } from '../controllers/txController';
import { restrictTo,protect } from '../controllers/authController';

const txRouter = express.Router();

//Only logged in user can access transactions
txRouter.use(protect)
txRouter.get('/myTransaction',myTransaction)
txRouter.post('/create',createTx)

//restricted to admin
txRouter.use(restrictTo('admin'))

txRouter.get('/',getAllTransactions)
txRouter.get('/:id',getTransaction)

export default txRouter;
