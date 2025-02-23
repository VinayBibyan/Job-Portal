const mongoose = require('mongoose');
require('dotenv').config();
// const mongoURL = process.env.LOCAL_DB_URL
const mongoURL = process.env.DB_URL

mongoose.connect(mongoURL,{
 // useNewUrlParser: true,
 // useUnifiedTopology: true
})

const db = mongoose.connection;
db.on('connected',()=>{
 console.log('connected to mongoDB server')
})
db.on('disconnected',()=>{
 console.log('disconnected to mongoDB server')
})

module.export = db;