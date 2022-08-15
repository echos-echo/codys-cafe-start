const Sequelize = require('sequelize')
const db = require('./database')
const Coffee = require('./coffee.model')

// defining the pugs table, to model Pug
const Pug = db.define('pugs', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  age: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  biography: {
    type: Sequelize.TEXT
  }
})

// Instance method: returns boolean of true/false if pug is a puppy or not
Pug.prototype.isPuppy = function() {
  return this.age < 1;
}

// Instance method: returns the first sentence of the pug's bio
Pug.prototype.shortBio = function() {
  // sliceEnd is the index of the first instance of a non alphanumeric or whitespace char
  const sliceEnd = this.biography.search(/[^\w\s]/);
  // checks if there is more than one sentence, or a bio at all.
  // sliceEnd could be < 0, which means the biography may have been null
  return sliceEnd >= 0 ? this.biography.slice(0, sliceEnd) : this.biography;
}

// Class method: finds all pugs who have the given coffee as their favorite
Pug.findByCoffee = async coffee => {
  return await Pug.findAll({
    include: {
      model: Coffee,
      as: 'favoriteCoffee',
      where: {
        name: coffee
      }
    }
  })
}

// Hook on Pug: capitalizes the pug's name before it gets saved!
Pug.beforeSave((pug) => {
  pug.name = pug.name[0].toUpperCase() + pug.name.slice(1);
})

module.exports = Pug
