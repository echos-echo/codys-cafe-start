const Sequelize = require('sequelize')
const db = require('./database')

const Coffee = db.define('coffee', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  ingredients: {
    type: Sequelize.DataTypes.ARRAY(Sequelize.STRING)
  }
})

Coffee.prototype.getIngredients = function() {
  return this.ingredients.join(', ')
}

Coffee.findByIngredient = async (ingredient) => {
  return await Coffee.findAll({
    where: {
      ingredients: { 
        [Sequelize.Op.contains]: [ingredient]}}
  });
}

// beforeSave will work for both create and update!!
Coffee.beforeSave(async (included) => {
  if (included.ingredients !== undefined)
    !included.ingredients.includes('love') ? included.ingredients.push('love') : included
})

module.exports = Coffee
