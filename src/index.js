const bodyParser = require('body-parser')
require('./db/db')
const express = require("express")
const app = express()
const userRoute = require('./routers/user')
const User = require('./models/User')

app.use(bodyParser.json())


const port = process.env.port



app.use(userRoute)







app.listen(port,()=> {
    console.log(`I'm running on port ${port}`)
})