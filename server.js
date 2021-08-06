//import
//const path=require('path')(deleted)
//const fs= require('fs') (deleted)
// const movieBook = require("./movieBook.js") //data is already in pg
const express=require('express');
const morgan = require("morgan");

//In terminal:
//Step 1: npm install
//Step 2: psql: Create DB (client), CREATE Table, Seed the data
//Step 3: npm run start dev --> "start-dev": "nodemon server.js"

//pg
const pg=require('pg');
const client = new pg.Client('postgres://localhost/movies')
client.connect();

//create the server 
const app=express()
app.listen(1256,()=>console.log('app is listening on Port 1256')) //does this have to be before or after the app.get code?

//Middleware
app.use(express.urlencoded({extended:false})) //what is this?? //listening for HTTP req, parse the info comes wiith the request
// app.use(express.static(__dirname, 'public')) //static files you don't want to change, eg. fixed
app.use(morgan('dev'))  

//GET / with async  //what's the difference between writing this way VS the js homework?

app.get('/', async(req,res,next)=>{
  try{ //all async in try 
    const movies = await client.query("SELECT * FROM movieslist"); //pg in use //movie.list()=[...movies], I need everything in this table.
    console.log(movies)
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
         <ul list-style="list-style:none;">
         ${movies.rows.map(movie=>{    //table is an {}
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
    res.status(500).send('Something Went Wrong.')
    } 
})

//GET /subpage

app.get('/movies/:id', async(req,res,next)=>{    //route specified in HTML
try{//const movies = movieBook.list();
    // const movie = movies.find(movie => movie.id === +req.params.id)
    const movieData = await client.query("SELECT * FROM movieslist WHERE id=$1", [req.params.id]);
    console.log(req.params.id)
    console.log(movieData)
    const movie=movieData.rows[0]
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
