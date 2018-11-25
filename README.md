# Express ToDo App

## Vaja installida:

Node: https://nodejs.org/en/download/

MongoDB: https://www.mongodb.com/download-center/community

## Rakenduse loomine

`git clone https://github.com/hensav/express-boilerplate.git`

`npm install`

`nodemon server`

## MongoDB installimine

### Mac os:

Homebrew abil

`brew update`

`brew install mongodb`

`mkdir -p /data/db`

Kontrolli üle `/data/db` õigused ``sudo chown -R `id -un` /data/db``

Mongo daemon: `mongod`

Mongo shell: `mongo`

Välju Mongo shellist run `quit()`

Peata Mongo daemon vajuta `ctrl-c`

### Windows:

Loo uus kaust kuhu andmebaasi failid tulevad

`mkdir data`

Ava uus cmd ja käivita MongoDB server (esimeseks asukohaks tuleb mongodb ja teiseks todo appi data kaust)

h`"C:\Program Files\MongoDB\Server\4.0\bin\mongod.exe" --dbpath` `C:\expressapp\todo\data`

Esimeses cmds käivita MongoDB

`"C:\Program Files\MongoDB\Server\4.0\bin\mongo.exe"`

Loo uus andmebaas

`use *andmebaasi nimi*`


## Mongodb liidestamine

`db.js` faili lisada

```
const mongoose = require('mongoose')

mongoose.Promise = global.Promise

mongoose.set('debug', true)

module.exports = mongoose.connect(process.env.MONGODB_URI_DEVELOPMENT)

```

`server.js `faili lisada

`const databaseConnection = require('./db')`

## Mongo mudeli loomine

```
const mongoose = require('mongoose')
const schema = mongoose.Schema({
    name: String
    },
  {
    timestamps: true
  })

module.exports = mongoose.model('todos', schema)

```

## Lisame routed

```
router.get('/list', asyncMiddleware(todo.list))
router.post('/addTodo', asyncMiddleware(todo.addTodo))
router.get('/removeTodo', asyncMiddleware(todo.removeTodo))
```