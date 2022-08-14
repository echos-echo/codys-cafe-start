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



module.exports = Pug
