const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const _id = jwt.verify(token, 'tokenpw')
        const user = await User.findOne({ _id, 'tokens.token': token })

        if (!user) {
            throw new Error()
        }
        req.token = token 
        req.user = user
        
        next()
    } catch (e) {
        res.status(401).send({ error: 'Not Authenticated. '})
    }
}

module.exports = auth