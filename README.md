# Express ToDo App

## Vaja installida:
Node: https://nodejs.org/en/download/
MongoDB: https://www.mongodb.com/download-center/community

# Rakenduse loomine

Lae alla githubist repo:
git clone https://github.com/hensav/express-boilerplate.git

Mine express-boilerplate kausta ja tõmba vajalikud dependencied:
`npm install`


Tõmba nodemon ja käivita server:
```
npm install nodemon -g
nodemon server
```

# MongoDB installimine

## Mac os
```
Homebrew abil:
brew update
brew install mongodb
mkdir -p /data/db
Kontrolli üle /data/db õigused sudo chown -R `id -un` /data/db
Mongo daemon: mongod
Mongo shell: mongo
Välju Mongo shellist run quit()
Peata Mongo daemon vajuta ctrl-c
```

## Windows

Loo uus kaust kuhu andmebaasi failid tulevad:
`mkdir data`

Ava uus cmd ja käivita MongoDB server (esimeseks asukohaks tuleb mongodb ja teiseks todo appi data kaust):
`"C:\Program Files\MongoDB\Server\4.0\bin\mongod.exe" --dbpath C:\express-boilerplate\data`

Käivita MongoDB:
`"C:\Program Files\MongoDB\Server\4.0\bin\mongo.exe"`

Loo uus andmebaas:
`use veebiraamistikud`

# Mongodb liidestamine

## db.js faili lisada
```
const mongoose = require('mongoose')

mongoose.Promise = global.Promise
mongoose.set('debug', true)

module.exports = mongoose.connect(process.env.MONGODB_URI_DEVELOPMENT)
```

Fail `.env.example` nimetame ümber `.env`

## server.js faili lisada
```
const databaseConnection = require('./db')
```

# Mudeli loomine

## models/todos.js faili lisada
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

# Rakenduse loogika

## utils/asyncMiddleware.js

Funktsioon mis võtab sisse funktsiooni ja wrapib selle promise sisse, nii me ei pea kasutama routede sees try / catchi
`module.exports = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)`



## routes.js failis const router ja module.exports vahele lisada
```
const todo = require('./controllers/todo')

router.get('/list', asyncMiddleware(todo.list))
router.post('/addTodo', asyncMiddleware(todo.addTodo))
router.delete('/removeTodo', asyncMiddleware(todo.removeTodo))
```

# Controller
## controllers/todo.js faili lisada
```
const Todos = require('../models/todos')
const { isValid } = require('mongoose').Types.ObjectId
```
TODO listi kuvamise funktsioon
```
exports.list = async (req, res) => {
 res.status(201).send(await Todos.find({}))
}
```
TODO lisamise funktsioon
```
exports.addTodo = async (req, res) => {
 const { name } = req.body

 const newTodo = await new Todos({
   name
 }).save()

 if (!newTodo) throw new Error('Not created')
 return res.status(201).send({ message: 'New todo created', data: newTodo})
}
```
TODO kustutamise funktsioon
```
exports.removeTodo = async (req, res) => {

 const { id } = req.body

 if (!isValid(id)) res.status(200).send(400, {message: 'invalid id'})
 const removeTodo = await Todos.findByIdAndRemove(id)

 res.status(200).send({message: "Todo removed", data: removeTodo})
}
```

# Front-end

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
    <h2>Add todo</h2>
    <input id="todoField">
    <button id="add">Add</button>
    <table id="todos"></table>
</body>
<script>
  window.onload = function(){
    listTodos()

    const addButton = document.getElementById("add")

    addButton.onclick = () => {
      let todoField = document.getElementById("todoField").value

      fetch("/api/addTodo", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({"name": todoField})
      })
        .then(() => {
          listTodos()
        })
    }

  }

  const listTodos = () => {
    const todos = fetch('/api/list')
      .then((r) => r.json())
      .then((r) => {
      console.log(r)
        let table = `
        <table style="width:100%">
                ${ r.map(todo => `<tr> <td> ${todo.name} </td> <td> <button onclick='deleteTodo("${todo._id}")'>Delete</button> </td> </tr>`).join(" ")}
        </table>
        `
        document.getElementById("todos").innerHTML = table
      })
  }

  const deleteTodo = (id) => {
    fetch("/api/removeTodo", {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({"id": id})
    })
      .then(listTodos())
  }
</script>
</html>
```

