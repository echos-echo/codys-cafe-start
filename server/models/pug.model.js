const Sequelize = require('sequelize')
const db = require('./database')
const Coffee = require('./coffee.model')

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

Pug.prototype.isPuppy = function() {
  return this.age < 1;
}

Pug.prototype.shortBio = function() {
  const sliceEnd = this.biography.search(/\W\s/);
  return sliceEnd >= 0 ? this.biography.slice(0, sliceEnd) : this.biography;
}


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

Pug.beforeSave((pug) => {
  pug.name = pug.name[0].toUpperCase() + pug.name.slice(1);
})

module.exports = Pug
