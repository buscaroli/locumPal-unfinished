const express = require('express')
const router = express()
const User = require('../models/user')
const auth = require('../middleware/auth')


router.use(express.json())


// Create User (Sign Up)
router.post('/users', async (req, res) => {
    const user = new User(req.body)
    
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})


// Login user
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByEmailAndPassword(req.body.email, req.body.password)
        const token = await user.generateAuthToken()

        res.send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
})


// Logout
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return (token.token !== req.token)
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})


// Logout from All Devices
router.post('/users/logoutall', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})


// Read all users (exp. to be removed after introducing auth)
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})


// Update one user by ID
router.patch('/users/me', auth, async (req, res) => {
    const user_id = req.user._id
    const new_data = req.body

    // Limiting the properties that can be updated to the ones in the array
    const allowedUpdate = ['name', 'password', 'email', 'phone']
    const updates = Object.keys(new_data)
    const isValidOperation = updates.every((prop) => {
        return allowedUpdate.includes(prop)
    })
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Operation not allowed.' })
    }

    // Updating user if found
    try {
        // const user = await User.findById(user_id)
        
        // if (!user) {
        //     return res.status(404).send()
        // }

        updates.forEach((prop) => {
            req.user[prop] = req.body[prop]
        })
        
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})


// Delete one user
router.delete('/users/me', auth, async (req, res) => {
    const user_id = req.user._id

    try {
        await req.user.remove()
        res.send(req.user)

    } catch (e) {
        res.status(500).send(e)
    }
})


module.exports = router