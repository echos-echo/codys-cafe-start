const db = require('./database')
const Pug = require('./pug.model')
const Coffee = require('./coffee.model')

// VVV assign relations below VVV //

/*
Coffee.belongsToMany(Pug, {
  through: 'favoriteCoffee'
})
Pug.belongsTo(Coffee, {
  through: 'favoriteCoffee'
}) */

Coffee.hasMany(Pug, {
  as: 'favoriteCoffee'
});
Pug.belongsTo(Coffee, {
  foreignKey: 'favoriteCoffeeId',
  as: 'favoriteCoffee'
})

Pug.belongsToMany(Pug, {
  through: 'pugId',
  as: 'friends'
})

// ^^^ assign relations above ^^^ //

module.exports = {
  db,
  Pug,
  Coffee
}
