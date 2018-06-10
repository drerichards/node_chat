const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const mongoose = require('mongoose')
const dbUrl = 'mongodb://user:user22@ds153980.mlab.com:53980/node-chat'

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

const messages = [
    {name: 'Tim', message: 'hi'},
    {name: 'Marty', message: 'hey'}
]

app.get('/messages', (req, res) => {
    res.send(messages)
})

app.post('/messages', (req, res) => {
    messages.push(req.body)
    io.emit('message', req.body)
    res.sendStatus(200)
})

io.on('connection', (socket) => {
    console.log('socket connected')
})

mongoose.connect(dbUrl, err => {
    err ? console.log(err) : console.log('mongo connected')
})
const server = http.listen(3000, () => {
    console.log('server on port', server.address().port)
})