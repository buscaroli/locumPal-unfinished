const express = require('express')
const router = express()
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

let myDB = [
    {
        company: 'Firm One',
        town:    'Poole',
        postcode: 'BH34 2NN',
        address:    '2000 Romanian Rd',
        phone:      '01303123456',
        PDA:        'Sal',   
    },
    {
        company: 'Firm Two',
        town:    'Sounthbourne',
        postcode: 'BH43 9ZZ',
        address:    '72 Draconian Way',
        phone:      '01404654321',
        PDA:        'Wendy',   
    },
    {
        town: '',
        phone: ''
    }
]

const author = {
    name: 'Matt',
    company: 'Bright Firm Ltd'
}


router.get('', (req, res) => {
    res.render('index', {
        town: myDB[0].town,
        phone: myDB[0].phone
    })
})

router.get('/data', (req, res) => {
    res.send(myDB)
})


router.get('/about', (req, res) => {
    res.render('about', {
        name: author.name,
        company: author.company
    })
})


router.get('/query', (req, res) => {
    res.render('query', {}) 
})


router.post('/query', (req, res) => {
    town = req.body.town
    postcode = req.body.postcode
    //res.render('query-result', { town, postcode })
    console.log(town) // not working ?!?
    res.redirect('map', { town, postcode })   
})


router.get('/map', (req, res) => {
    res.render('map', {town: req.town, postocode: req.postcode})
})


router.get('*', (req, res) => {
    res.render('404', {})
})


module.exports = router