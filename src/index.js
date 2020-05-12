const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const shiftRouter = require('./routers/shift')
const path = require('path')
// const hbs = require('hbs')

const app = express()
const port = process.env.PORT || 3000

// const publicPath = path.join(__dirname, '../public')
// const partialPath = path.join(__dirname, '../views')


// app.use(express.static(publicPath))


app.use(userRouter)
app.use(shiftRouter)


// app.set('view engine', 'hbs')
// hbs.registerPartials(partialPath)



// Starting the Server

app.listen(port, () => {
    console.log(`Server up on port ${ port }`)
})