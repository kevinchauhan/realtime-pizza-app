require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const ejs = require('ejs')
const expressLayout = require('express-ejs-layouts')
const PORT = process.env.PORT || 3000
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('express-flash')
const MongoStore = require('connect-mongo')

// Database connection
const url = 'mongodb://127.0.0.1/pizza';
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
});
const connection = mongoose.connection

connection.on('error', (err) => {
    console.error('Connection error:', err);
});

connection.once('open', () => {
    console.log('Database connected...');
});

// middlewares ------------------------------> 

// session store in db
const mongoStoreInstance = new MongoStore({
    mongoUrl: 'mongodb://127.0.0.1/pizza',
    mongooseConnection: connection,
    collectionName: 'sessions',
  });

// Session config
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: mongoStoreInstance,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } //cookie valid till 24hr
    // cookie: { maxAge: 1000 * 15 } //cookie valid till 15s to check it is deleing or not in db
}))

// cookie
app.use(flash())

// Assets
app.use(express.static('public'))

// set template engine (its should be placed before routes)
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

// middlewares ------------------------------x

// routes
const routes = require('./routes/web')
routes(app)

// listening server
app.listen(PORT, () => {
    console.log('listening on port', PORT)
})

