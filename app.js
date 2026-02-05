const express = require('express')
const app = express()

app.listen(7779)

const userRouter = require('./routes/users') //user-demo
const channelRouter = require('./routes/channels') //channel-demo

app.use("/", userRouter)
app.use("/channels", channelRouter)
