const router = require('express').Router()
const {Coffee} = require('../models')

// Your code here!
// Remember that these routes are already mounted on
// /api/coffee!

// handles all '/coffee' routes (get, post)
router.route('/')
    // gets all coffees
    .get(async (req, res, next) => {
        try {
            res.send(await Coffee.findAll())
        } catch(err) {
            next(err);
        }
    })
    // creates a new coffee item
    .post(async (req, res, next) => {
        try {
            res.status(201).send(await Coffee.create(req.body));
        } catch(err) {
            next(err);
        }
    })

// gets all coffee drinks that use the given ingredient
router.get('/ingredients/:ingredientName', async (req, res, next) => {
    try {
        res.send(await Coffee.findByIngredient(req.params.ingredientName));
    } catch(err) {
        next(err);
    }
})

// gets the coffee of the given id
router.get('/:coffeeId', async (req, res, next) => {
    try {
        const coffee = await Coffee.findByPk(req.params.coffeeId)
        if (coffee === null) {
            res.sendStatus(404);
        } else {
            res.send(coffee);
        }
    } catch(err) {
        next(err);
    }
})

module.exports = router
