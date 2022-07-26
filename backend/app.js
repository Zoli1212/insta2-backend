const express = require('express')

const app = express()

const mongoose = require('mongoose')


const { MONGO_URI} = require('./keys')

require('./models/user')
require('./models/post')
mongoose.model('User')
app.use(express.json())
app.use('/api', require('./routes/auth'))
app.use('/api', require('./routes/post'))

const port = 5000

mongoose.connect(MONGO_URI)
mongoose.connection.on('connected', () =>{
    console.log('Connected to mongo')
})

mongoose.connection.on('error', (err) => {
    console.log('error in connection', err)
})

app.listen(port, () => {
    console.log('server is running on port', port)
})