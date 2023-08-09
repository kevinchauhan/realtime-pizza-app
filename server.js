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
const passport = require('passport')
const Emitter = require('events')

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

// event emitter
const eventEmitter = new Emitter()
app.set('eventEmitter',eventEmitter) // bind with app 

// Session config
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: mongoStoreInstance,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } //cookie valid till 24hr
    // cookie: { maxAge: 1000 * 15 } //cookie valid till 15s to check it is deleing or not in db
}))

// Passport config (it should be after session config)
const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())


// cookie
app.use(flash())

// Assets
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())  // to parse the req body

// global middleware - it is used to get session variable into ejs file
app.use((req, res, next) => {
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})

// set template engine (its should be placed before routes)
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

// middlewares ------------------------------x

// routes
const routes = require('./routes/web')
routes(app)

// listening server
const server = app.listen(PORT, () => {
    console.log('listening on port', PORT)
})


// socket.io
const { Server } = require('socket.io')
const io = new Server(server) // server which is listening on above port
io.on('connection',(socket)=>{
    // join
    // console.log(socket.id)
    socket.on('join',(roomName)=>{
        socket.join(roomName)
    })
})

// listening event emitted from statusController
eventEmitter.on('orderUpdated',(data)=>{
    io.to(`order_${data.id}`).emit('orderUpdated',data)
})

// listening event emitted from orderController
eventEmitter.on('orderPlaced',(data)=>{
    io.to('adminRoom').emit('orderPlaced',data)
})