const dotenv = require('dotenv');
const mongoose = require('mongoose')
const app = require('./app');

dotenv.config({ path:'./config.env'});


// for development
const DB = process.env.DB_LOCAL

//DB connection
mongoose.connect(DB).then((connection)=>{
  console.log("DB connection is successfull");
}).catch((err)=>{
  console.log(err)
})

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`App starts listening on port ${PORT}....`);
});
