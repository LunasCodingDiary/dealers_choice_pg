//import
//const path=require('path')(deleted)
//const fs= require('fs') (deleted)
// const movieBook = require("./movieBook.js") //data is already in pg
const express=require('express');
const morgan = require("morgan");

//In terminal:
//Step 1: npm install
//Step 2: psql: Create DB (client), CREATE Table, Seed the data
//Step 3: npm run server 

//pg
const pg=require('pg');
const client = new pg.Client('postgres://localhost/movies')
client.connect();

//create the server 
const app=express()
const server=app.listen(1256) //does this have to be before or after the app.get code?

//Middleware
app.use(urlencoded({extend:false})) //what is this??
app.use(express.static(__dirname, 'public'))
app.use(morgan('dev'))  

//Route
const routes = require('/routes/posts')
app.use('/', routes)

//GET / with async  //what's the difference between writing this way VS the js homework?

app.get('/', async(req,res, next)=>{
  try{  
  const movies = await client.query("SELECT * FROM movielist"); //pg in use //movie.list()=[...movies], I need everything in this table.
    const html = `<!DOCTYPE html>
    <html>
    <head>
      <title>Movie Book</title>
      <style>
      *{
        text-align:center
      }
      </style>
    </head> 
    <body>
      <h1>MovieBook</h1>
         <ul style="list-style-type:none;">
         ${movies.map(movie=>{
           return ` 
           <li>
             <a href='/movies/${movie.id}'> 
             ${movie.title}
             </a> 
           </li>`
            }).join('')
           }     
         </ul>
    </body>
    </html>`
    res.send(html)
  }catch(error){
    next(error)
    res.status(500).send('Somegthing Went Wrong.')
    } 
})

//GET /subpage

app.get('/movies/:id', async(req,res,next)=>{
try{const movies = movieBook.list();
    // const movie = movies.find(movie => movie.id === +req.params.id)
    const movie = await client.query("SELECT * FROM movielist WHERE movie.title=$1", [req.params.id]);
    const html2 =`<!DOCTYPE html>
    <html>
    <head>
      <title>${movie}</title>
      <style>
      *{
        text-align:center
      }
      </style>
    </head> 
    <body>
      <h1>MovieBook</h1>
      <h2> ${movie.title} </h2>
      <p>
      Genre: ${movie.genre} 
      </p>
      <p>
      Synopsis: ${movie.synopsis}
      </p>
    </body>`  
    res.send(html2)
} catch(error){
  next(error)
  res.status(500).send('Somegthing Went Wrong.')
  }
})
