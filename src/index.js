const bodyParser = require('body-parser')
require('./db/db')
const express = require("express")
const app = express()
const userRoute = require('./routers/user')
const taskRoute = require('./routers/task')
const User = require('./models/User')


app.use(bodyParser.json())


const port = process.env.port

app.use(userRoute)
app.use(taskRoute)

app.listen(port,()=> {
    console.log(`I'm running on port ${port}`)
})




const multer = require('multer')
const upload = multer({
    dest: 'images'
})

app.post('/upload', upload.single('upload'), (req,res)=> {
    res.send()
})
const Task = require('./models/Task')
const main = async () => {
    //user that created a task
    // const task = await Task.findById('5e184696ff44f556ac9c0070')
    // await task.populate('owner').execPopulate()
    // console.log(task.owner)
       
    //finding a user and their task
    // const user = await User.findById('5e1845d1ff44f556ac9c006e-')
    // await user.populate('tasks').execPopulate()
    // console.log(user.tasks)
}

main()