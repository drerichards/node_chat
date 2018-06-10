const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const mongoose = require('mongoose')
const dbUrl = 'mongodb://user:user22@ds153980.mlab.com:53980/node-chat'

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))

mongoose.Promise = Promise

const Message = mongoose.model('Message', {
    name: String,
    message: String
})

app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        err ? console.log(err) : res.send(messages)
    })
})

app.post('/messages', (req, res) => {
    const message = new Message(req.body)
    message.save()
        .then(() => {
            console.log('saved')
            return Message.findOne({
                message: 'bad word'
            })
        }).then(censored => {
            if (censored) {
                console.log('Censored Word: ', censored)
                return Message.remove({
                    _id: censored.id
                }, err => {
                    console.log('Removed censored message')
                })
            }
            io.emit('message', req.body)
            res.sendStatus(200)
        }).catch(err => {
            res.sendStatus(500)
            return console.error(err)
        })
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