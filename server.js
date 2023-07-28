const express = require('express')
const app = express()
const path = require('path')
const ejs = require('ejs')
const expressLayout = require('express-ejs-layouts')

const PORT = process.env.PORT || 3000

// Assets
app.use(express.static('public'))

// set template engine (its should be placed before routes)
app.use(expressLayout)
app.set('views',path.join(__dirname,'/resources/views'))
app.set('view engine','ejs')


// routes
app.get('/',(req,res)=>{
    res.render('home')
})
app.get('/cart',(req,res)=>{
    res.render('customer/cart')
})
app.get('/login',(req,res)=>{
    res.render('auth/login')
})
app.get('/register',(req,res)=>{
    res.render('auth/register')
})

// listening server
app.listen(PORT,()=>{
    console.log('listening on port',PORT)
})