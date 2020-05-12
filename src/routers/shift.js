const express = require('express')
const router = express()
const Shift = require('../models/shift')

router.use(express.json())

// Create Shift
router.post('/shifts', async (req, res) => {
    const shift = new Shift(req.body)

    try {
        await shift.save()
        res.status(201).send(shift)
    } catch (e) {
        res.status(400).send(e)
    }
})


// Read all shifts (exper. to be removed)
router.get('/shifts', async (req, res) => {
    
    try {
        const all_shifts = await Shift.find({})
        res.send(all_shifts)
    } catch (e) {
        res.status(500).send(e)
    }
    
})


// Read one shift by ID
router.get('/shifts/:id', async (req, res) => {
    const shift_id = req.params.id
    
    try {
        const shift = await Shift.findById(shift_id)
        if(!shift) {
            return res.status(404).send()
        }
        res.send(shift)
    } catch (e) {
        res.status(500).send(e)
    }
})


// Update one shift
router.patch('/shifts/:id', async (req, res) => {
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
        const shift = await Shift.findById(shift_id)
        
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
router.delete('/shifts/:id', async (req, res) => {
    const shift_id = req.params.id

    try {
        const shift = await Shift.findByIdAndDelete(shift_id)

        if (!shift) {
            return res.status(404).send()
        }
        res.send(shift)
    } catch (e) {
        res.status(500).send(e)
    }
})



module.exports = router