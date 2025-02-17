const express = require('express')
const app = express()
const db = require('./db');
require('dotenv').config()

const cors = require('cors')
app.use(cors({
  origin: "*", 
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));

app.options("*", cors());

const bodyParser = require('body-parser');
app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.send('Welcome to the job portal')
})

const authRoutes = require('./routes/authRoutes')
const recruiterRoutues = require('./routes/recruiterRoutes')
const jobRoutes = require('./routes/jobRoutes')


app.use('/auth', authRoutes);
app.use('/recruiter', recruiterRoutues);
app.use('/job', jobRoutes);

app.listen(3000)