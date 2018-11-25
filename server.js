require('dotenv').config()

const port = process.env.PORT || 3000
const app = require('./app')

const databaseConnection = require('./db')

;(async () => {
  try {
    await databaseConnection
    const serverConnection = app.listen(port, () => console.log(`\nServer started\n`))

    process.on('SIGINT', () => { databaseConnection.close() && serverConnection.close() &&
    console.log('\nServer was shut down\n') })

  } catch (error) { console.log(`\nServer encountered ${error}\n`) }
})()
