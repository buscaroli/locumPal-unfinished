const express = require('express')
const router = express()
const Shift = require('../models/shift')
const auth = require('../middleware/auth')

router.use(express.json())


// Create Shift
router.post('/shifts',auth, async (req, res) => {
    
    const shift = new Shift({
        ...req.body,
        locum: req.user._id
    })

    try {
        await shift.save()
        res.status(201).send(shift)
    } catch (e) {
        res.status(400).send(e)
    }
})


// Read all tasks from auth user
router.get('/shifts', auth, async (req, res) => {
    const user_id = req.user._id

    try {
        await req.user.populate('shifts').execPopulate()
        res.send(req.user.shifts)
    } catch (e) {
        res.status(500).send()
    }
})


// Read one shift by ID
router.get('/shifts/:id', auth, async (req, res) => {
    const shift_id = req.params.id
    console.log(shift_id)
    
    try {
        const shift = await Shift.findOne({ _id: shift_id, locum: req.user._id })
        console.log(shift)
        
        if(!shift) {
            return res.status(404).send()
        }
        res.send(shift)
    } catch (e) {
        res.status(500).send(e)
    }
})


// Update one shift
router.patch('/shifts/:id', auth, async (req, res) => {
    const shift_id = req.params.id
    const new_data = req.body

    // Limiting the properties that can be updated to the ones in the array
    const allowedUpdate = ['user_name', 'store_name', 'shift_date', 'starting_time', 'ending_time', 'lunch_break',
                           'hourly_rate', 'hours', 'paid', 'date_paid']
    const updates = Object.keys(new_data)
    const isValidOperation = updates.every((prop) => {
        return allowedUpdate.includes(prop)
    })
    if (!isValidOperation){
        return res.status(400).send({ error: 'Operation not allowed.'})
    }

    try {
        // const shift = await Shift.findById(shift_id)
        const shift = await Shift.findOne({ _id: shift_id, locum: req.user._id})
        
        if (!shift){
            return res.status(404).send()
        }
        updates.forEach((prop) => {
            shift[prop] = req.body[prop]
        })
        
        await shift.save()
        res.send(shift)
    } catch (e) {
        res.status(500).send(e)
    }
})


// Delete one shift
router.delete('/shifts/:id', auth, async (req, res) => {
    const shift_id = req.params.id

    try {
        const shift = await Shift.findOneAndDelete({ _id: shift_id, locum: req.user._id })
        
        if (!shift) {
            return res.status(404).send()
        }
        res.send(shift)
    } catch (e) {
        res.status(500).send(e)
    }
})



module.exports = router