const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');
const passportLocal = require('passport-local').Strategy;
const session = require('express-session');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const route = require('./routes');
const app = express();
dotenv.config();
mongoose
    .connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        })
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.log(error));


app.use(cors());
app.use(morgan('combined'));
app.use(cookieParser());
app.use(express.json());
route(app);
app.listen(8000, () => console.log('Server Running'));


