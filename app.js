const express = require('express');
const globalErrorHandler = require('./controllers/globalErrorHandler');
const userRouter = require('./routes/userRoutes')
const txRouter = require('./routes/txRoutes')

const app = express();

app.use(express.json());

app.use('/api/v1/users',userRouter)
app.use('/api/v1/transactions',txRouter)



//Error handling middleware
//4 areguments -> express will autmetically recognize it as a error handling middleware
//and only call it when there is a error
app.use(globalErrorHandler)

module.exports = app;
