/* eslint-env mocha, chai */

const {expect} = require('chai')
const {db, Coffee} = require('../server/models')

describe.only('Coffee model', () => {
  beforeEach(() => db.sync({force: true}))

  describe('column definitions and validations', () => {
    it('has a `name` and `ingredients`', async () => {
      const puppaccino = await Coffee.create({
        name: 'Puppaccino',
        ingredients: ['espresso', 'frothed milk', 'love']
      })

      expect(puppaccino.name).to.equal('Puppaccino')
      expect(puppaccino.ingredients).to.deep.equal(['espresso', 'frothed milk', 'love'])
    })

    it('`name` is required', async () => {
      const coffee = Coffee.build()
      return coffee.validate()
        .then(
          () => {
            throw new Error('Validation should have failed!')
          },
          (err) => {
            expect(err).to.be.an('error')
          }
        )
    })
  })

  describe('instance method: getIngredients', () => {
    it('returns list of ingredients as a comma-delimited string', async () => {
      const puppaccino = await Coffee.create({
        name: 'Puppaccino',
        ingredients: ['espresso', 'frothed milk', 'love']
      })

      const frappeAllaPug = await Coffee.create({
        name: 'Frappe alla Pug',
        ingredients: ['espresso', 'ice', 'sugar', 'love']
      })

      expect(puppaccino.getIngredients()).to.equal('espresso, frothed milk, love')
      expect(frappeAllaPug.getIngredients()).to.equal('espresso, ice, sugar, love')
    })
  })

  // Arf! You'll use the Sequelize.Op.contains operator here!
  // https://sequelize.org/v5/manual/querying.html#operators
  // Be careful! It's a little bit unintuitive because the value you're
  // querying for needs to be in an array (even if it's just one value):
  //
  // where: {
  //   my_array: {
  //     [Op.contains]: ['thing']
  //   }
  // }
  describe('class method: findByIngredient', () => {
    it('finds coffee by ingredient', async () => {
      await Promise.all([
        Coffee.create({
          name: 'Cafe au Lait',
          ingredients: ['french press', 'scalded milk']
        }),
        Coffee.create({
          name: 'Galao',
          ingredients: ['espresso', 'foam']
        }),
        Coffee.create({
          name: 'Mocha',
          ingredients: ['espresso', 'hot cocoa', 'whipped cream']
        })
      ])
      const drinksWithEspresso = await Coffee.findByIngredient('espresso')
      const drinksWithWhippedCream = await Coffee.findByIngredient('whipped cream')

      expect(drinksWithEspresso.length).to.equal(2)
      expect(drinksWithEspresso.some(drink => drink.name === 'Mocha')).to.equal(true)
      expect(drinksWithEspresso.some(drink => drink.name === 'Galao')).to.equal(true)

      expect(drinksWithWhippedCream.length).to.equal(1)
      expect(drinksWithWhippedCream.some(drink => drink.name === 'Mocha')).to.equal(true)
    })
  })

  describe('hooks', () => {
    // because EVERYTHING in Cody's Cafe is made with love ♥
    it('adds "love" to ingredients if not included', async () => {
      const coffee = await Coffee.create({
        name: 'Cafe con Leche',
        ingredients: ['coffee', 'warm milk']
      })

      expect(coffee.ingredients.indexOf('love') > -1).to.equal(true)

      await coffee.update({
        ingredients: ['coffee', 'hot milk']
      })

      expect(coffee.ingredients.indexOf('love') > -1).to.equal(true)
    })
  })
})
