import express from 'express';
import globalErrorHandler from './controllers/globalErrorHandler';
import userRouter from './routes/userRoutes';
import txRouter from './routes/txRoutes'
const app = express();

app.use(express.json());

app.use('/api/v1/users',userRouter)
app.use('/api/v1/transactions',txRouter)



//Error handling middleware
//4 areguments -> express will autmetically recognize it as a error handling middleware
//and only call it when there is a error
app.use(globalErrorHandler)

module.exports = app;
