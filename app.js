
const express = require('express')
const chalk = require('chalk')

const app = express()
const database = require('./database')

//MIDLEWARE
app.use(express.json())
app.use(express.urlencoded({extended: false}))

database.connect((error)=>{
  if(error){
    console.log(error)
  } else {
    console.log(chalk.green.inverse('Connected succesfully to Database'))
  }
})

//GET Home page
app.get('/', (request, response)=>{
  response.send('Welcome to Padel API')
})

//GET All players
app.get('/players', (request, response)=>{
  database.promise().query('SELECT * FROM players')
  .then((result)=>{
    response.json(result[0])
  })
  .catch((err)=>{
    console.log(err)
  })
})

//GET players by country
app.get('/players/:country', (request, response)=>{
  database.promise().query('SELECT * FROM players WHERE country=?', [request.params.country])
  .then((result)=>{
    response.json(result[0])
  })
  .catch((err)=>{
    console.log(err)
  })
})

//POST new player
app.post('/players/new', (request, response)=>{
  const {firstName, lastName, position, brand, ranking, age, country} = request.body

  database.promise().query(
    'INSERT INTO players (firstName, lastName, position, brand, ranking, age, country) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [firstName, lastName, position, brand, ranking, age, country]
  )
  .then((result)=>{
    response.json(result[0])
  })
  .catch((err)=>{
    console.log(err)
  })
})

//DELETE player
app.delete('/players/delete/:id', (request, response)=>{
  
  database.promise().query('DELETE FROM players WHERE id=?', [request.params.id])
  .then((result)=>{
    response.json(result[0])
  })
  .catch((err)=>{
    console.log(err)
  })
})

app.listen(5000, ()=>{
  console.log(chalk.cyan.inverse('Server ready and open at PORT 5000'))
})