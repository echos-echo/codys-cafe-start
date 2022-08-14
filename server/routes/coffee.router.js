const router = require('express').Router()
const {Coffee} = require('../models')

// Your code here!
// Remember that these routes are already mounted on
// /api/coffee!
router.get('/', async (req, res, next) => {
    try {
        res.send(await Coffee.findAll())
    } catch(err) {
        next(err);
    }
})

router.get('/ingredients/:ingredientName', async (req, res, next) => {
    try {
        res.send(await Coffee.findByIngredient(req.params.ingredientName));
    } catch(err) {
        next(err);
    }
})

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

router.post('/', async (req, res, next) => {
    try {
        res.status(201).send(await Coffee.create(req.body));
    } catch(err) {
        next(err);
    }
})




module.exports = router
