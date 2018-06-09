const express = require('express')
const app = express()

app.use(express.static(__dirname))

const messages = [
    {name: 'Tim', message: 'hi'},
    {name: 'Marty', message: 'hey'}
]

app.get('/messages', (req, res) => {
    res.send(messages)
})

const server = app.listen(3000, () => {
    console.log('server on port', server.address().port)
})