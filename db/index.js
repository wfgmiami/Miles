const conn = require('./db');

const Model = require('./Model');

const sync = () =>{
  return conn.sync({ force: true })
}

const names = ['alex', 'tom','matt'];

const seed = () =>{
  return sync()
    .then( () => Promise.all(names.map(name => Model.create({ name }))))
}

module.exports = {
  seed,
  models: {
    Model
  }
}
