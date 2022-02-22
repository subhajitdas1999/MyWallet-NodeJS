const dotenv = require('dotenv');

dotenv.config({ path: '../config.env' });

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if(process.env.NODE_ENV === 'development'){
      res.status(err.statusCode).json({
          status:err.status,
          message:err.message,
          error:err,
          stack:err.stack
      })
  }else{
    res.status(err.statusCode).json({
        status:err.status,
        message:err.message,
    })

  }
};
