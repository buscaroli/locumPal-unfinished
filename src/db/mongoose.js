const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/locumpal', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})