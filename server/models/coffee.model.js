const Sequelize = require('sequelize')
const db = require('./database')

// defining the coffee table, to model Coffee
const Coffee = db.define('coffee', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  ingredients: {
    type: Sequelize.DataTypes.ARRAY(Sequelize.STRING)
  }
})

// Instance method: gets a list of all ingredients of the coffee object, in string format
Coffee.prototype.getIngredients = function() {
  return this.ingredients.join(', ')
}

// Class method: finds all coffees that use the given ingredient
Coffee.findByIngredient = async (ingredient) => {
  return await Coffee.findAll({
    where: {
      ingredients: { 
        [Sequelize.Op.contains]: [ingredient]}}
  });
}

// beforeSave will work for both create and update!!
// adds the ingredient 'love' if it is not in the ingredients array!!!
Coffee.beforeSave(async (included) => {
  if (included.ingredients !== undefined)
    !included.ingredients.includes('love') ? included.ingredients.push('love') : included
})

module.exports = Coffee
