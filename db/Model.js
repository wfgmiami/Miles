const conn = require('./db');

const Model = conn.define('model',{
  name: {
    type: conn.Sequelize.STRING
  },
  age: {
    type: conn.Sequelize.INTEGER
  }
})

module.exports = Model;
