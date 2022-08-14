/* eslint-env mocha, chai */

const {expect} = require('chai')
const {db, Pug, Coffee} = require('../server/models')

describe('Pug model', () => {
  beforeEach(() => db.sync({force: true}))

  describe('column definitions and validations', () => {
    it('has a `name`, `age`, and `biography`', async () => {
      const pug = await Pug.create({
        name: 'Cody',
        age: 7,
        biography: 'He is a pug!'
      })

      expect(pug.name).to.equal('Cody')
      expect(pug.age).to.equal(7)
      expect(pug.biography).to.equal('He is a pug!')
    })

    it('`name` is required', () => {
      const pug = Pug.build()
      return pug.validate()
        .then(
          () => {
            throw new Error('Validation should have failed!')
          },
          (err) => {
            expect(err).to.be.an('error')
          }
        )
    })

    it('`age` has a default value of 0', async () => {
      const pug = await Pug.create({name: 'Cody'})
      expect(pug.age).to.equal(0)
    })

    it('`biography` can hold a longer string', async () => {
      const longBio = `The breed is often described by the Latin phrase multum in parvo, or "much in little" or "a lot of dog in a small space", alluding to the Pug's remarkable and charming personality, despite its small size. Pugs are strong willed but rarely aggressive, and are suitable for families with children. The majority of the breed is very fond of children and sturdy enough to properly play with them. Depending on their owner's mood, they can be quiet and docile but also vivacious and teasing. Pugs tend to be intuitive and sensitive to the moods of their owners and are usually eager to please them. Pugs are playful and thrive on human companionship. They also tend to have a snoozy nature and spend a lot of time napping. Pugs are often called "shadows" because they follow their owners around and like to stay close to the action, craving attention and affection from their owners.`

      const pug = await Pug.create({name: 'Wiki', biography: longBio})
      expect(pug.name).to.equal('Wiki')
      expect(pug.biography).to.equal(longBio)
    })

    // Make sure that you define the associations in `server/models/index.js`!
    // Note: this requires a working Coffee model
    it('has a one-many relationship with Coffee, via `favoriteCoffee`', async () => {
      const pug = await Pug.create({name: 'Joe'})
      const coffee = await Coffee.create({
        name: 'Puppaccino',
        ingredients: ['espresso', 'frothed milk', 'love']
      })

      await pug.setFavoriteCoffee(coffee)
      expect(pug.favoriteCoffeeId).to.be.equal(coffee.id)
    })

    // Make sure that you define the associations in `server/models/index.js`!
    // Note: be careful - the pluralization is important here!
    it('has a many-many relationship with other Pugs as `friends`', async () => {
      const penny = await Pug.create({name: 'Penny'})
      const doug = await Pug.create({name: 'Doug'})
      await penny.addFriend(doug)
      const friends = await penny.getFriends()
      expect(friends).to.be.an('array')
      expect(friends.length).to.equal(1)
      expect(friends[0].name).to.equal('Doug')
    })
  })

  describe('instance method: isPuppy', () => {
    it('returns true if a pug is a puppy (less than one year old)', async () => {
      const pup = await Pug.create({name: 'Pupster', age: 0})
      const notPup = await Pug.create({name: 'Grouchy', age: 2})

      expect(pup.isPuppy()).to.equal(true)
      expect(notPup.isPuppy()).to.equal(false)
    })
  })

  describe('instance method: shortBio', () => {
    // Note: the first sentence might be defined as all of the text
    // leading up to but not including the first period,
    // question mark, or exclamation point.
    it('returns first sentence of bio', async () => {
      const cody = await Pug.create({
        name: 'Cody',
        biography: 'He is a pug. A cuddly pug. But also kind of a brat.'
      })

      const doug = await Pug.create({
        name: 'Doug',
        biography: 'He is internet famous! Quite a popular pug.'
      })

      const penny = await Pug.create({
        name: 'Penny',
        biography: 'Who is Penny the Pug? Only the most popular pug around!'
      })

      expect(cody.shortBio()).to.be.equal('He is a pug')
      expect(doug.shortBio()).to.be.equal('He is internet famous')
      expect(penny.shortBio()).to.be.equal('Who is Penny the Pug')
    })
  })

  // Check out: http://docs.sequelizejs.com/manual/tutorial/querying.html#relations-associations
  describe('class method: `findByCoffee`', () => {
    it('finds all pugs with the given favorite coffee', async () => {
      const latte = await Coffee.create({name: 'latte'})
      const cortado = await Coffee.create({name: 'cortado'})
      await Promise.all([
        Pug.create({name: 'Cody', favoriteCoffeeId: latte.id}),
        Pug.create({name: 'Doug', favoriteCoffeeId: cortado.id}),
        Pug.create({name: 'Penny', favoriteCoffeeId: latte.id})
      ])

      const latteLovers = await Pug.findByCoffee('latte')
      const cortadoCourtiers = await Pug.findByCoffee('cortado')

      expect(latteLovers.length).to.equal(2)
      expect(latteLovers.some(pug => pug.name === 'Cody')).to.equal(true)
      expect(latteLovers.some(pug => pug.name === 'Penny')).to.equal(true)

      expect(cortadoCourtiers.length).to.equal(1)
      expect(cortadoCourtiers.some(pug => pug.name === 'Doug')).to.equal(true)
    })

    it('finds pugs and eagerly loads their favorite coffee', async () => {
      const espresso = await Coffee.create({name: 'espresso'})
      const joe = await Pug.create({name: 'Joe', favoriteCoffeeId: espresso.id})

      const espressoEnthusiasts = await Pug.findByCoffee('espresso')

      expect(espressoEnthusiasts[0].name).to.equal(joe.name)
      expect(espressoEnthusiasts[0].favoriteCoffee.id).to.equal(espresso.id)
    })
  })

  describe('hooks', () => {
    it('capitalizes a pug\'s name before saving it to the database', async () => {
      const pug = await Pug.create({name: 'joe'})

      expect(pug.name).to.equal('Joe')

      const pupdatedPug = await pug.update({name: 'joey'})

      expect(pupdatedPug.name).to.equal('Joey')
    })
  })
})
