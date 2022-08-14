const router = require('express').Router()
const {Pug} = require('../models')

// Your code here!
// Remember that these routes are already mounted on
// /api/pugs!
router.get('/', async (req, res, next) => {
    try {
        res.send(await Pug.findAll());
    } catch(err) {
        next(err);
    }
})

router.get('/favoriteCoffee/:favoriteCoffeeName', async (req, res, next) => {
    try {
        res.send(await Pug.findByCoffee(req.params.favoriteCoffeeName));
    } catch(err) {
        next(err);
    }
})

router.post('/', async (req, res, next) => {
    try {
        res.status(201).send(await Pug.create(req.body));
    } catch(err) {
        next(err);
    }
})

router.route('/:pugId')
    .get(async (req, res, next) => {
        try {
            const pug = await Pug.findByPk(req.params.pugId)
            if (pug === null) {
                res.sendStatus(404);
            } else {
                res.send(pug);
            }
        } catch(err) {
            next(err);
        }
    })
    .put(async (req, res, next) => {
        try {
            const pug = await Pug.findByPk(req.params.pugId);
            if (pug === null) {
                res.sendStatus(404);
            } else {
                pug.set(req.body);
                await pug.save();
                await Pug.sync();
                res.send(pug);
            }
        } catch(err) {
            next(err);
        }
    })
    .delete(async (req, res, next) => {
        try {
            if (await Pug.findByPk(req.params.pugId) === null) {
                res.sendStatus(404);
            } else {
                await Pug.destroy({
                    where: {
                        id: req.params.pugId
                    }
                })
                res.sendStatus(204);
            }
        } catch(err) {
            next(err);
        }
    })

module.exports = router
