const express = require('express')
const router = express()
const bodyParser = require('body-parser');

const middlewares = [
  bodyParser.urlencoded({ extended: true }),
];


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
    
    res.render('query', {
        town: res.town,
        phone: res.phone
    }) 
})


router.post('/query', (req, res) => {
    res.render('query', {
        town: req.town,
        phone: req.phone
    })
    
})


router.get('*', (req, res) => {
    res.render('404', {})
})


module.exports = router