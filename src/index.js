const express = require('express')
const path = require('path')
const userRouter = require('./routers/user')
const hbs = require('hbs')


const publicPath = path.join(__dirname, '../public')
const partialPath = path.join(__dirname, '../views')

const app = express()
const port = process.env.PORT || 3000

app.use(express.static(publicPath))
app.use(userRouter)
app.set('view engine', 'hbs')
hbs.registerPartials(partialPath)



// Starting the Server

app.listen(port, () => {
    console.log(`Server up on port ${ port }`)
})