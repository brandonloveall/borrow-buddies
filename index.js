require("dotenv").config()
const axios = require("axios")
const express = require("express")
const app = express()
const path = require("path")
const cors = require("cors")
const {Sequelize} = require("sequelize")
const AWS = require("aws-sdk")
const fileUpload = require("express-fileupload")
let fs = require("fs")
let s3 = new AWS.S3({params: {Bucket: "borrowbuddies"}})
const {v4} = require("uuid")
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: "postgres",
        dialectOptions: {
            ssl: {
                rejectUnauthorized: false
            }
        }
})

sequelize.authenticate()

app.use(cors())
app.use(express.json())
app.use(fileUpload({useTempFiles: true, tempFileDir: "/tmp/"}))
app.use(express.urlencoded())
app.use(express.static(path.join(__dirname, "build")))

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname), "build", "index.html")
})

app.get("/c/*", (req, res) => {
    res.sendFile(path.join(__dirname), "build", "index.html")
})

app.post("/api/setimg", (req, res) => {
    const key = v4()

    if(!req.query.prev){
        fs.readFile(req.files.image.tempFilePath, (err, data1) => {
            if(err){console.log(err); return}
            
            s3.upload({Bucket: "borrowbuddies", Key: key, Body: data1}, (err, data2) => {
                if(err){console.log(err); return}
                console.log(data2)
    
                res.status(200).send({location: data2.Location, Key: data2.Key})
    
            })
        })
    }
    else{
        fs.readFile(req.files.image.tempFilePath, (err, data1) => {
            if(err){console.log(err); return}
            
            s3.deleteObject({Bucket: "borrowbuddies", Key: req.query.prev,}, () => {
                if(err){console.log(err)}
            })

            s3.upload({Bucket: "borrowbuddies", Key: key, Body: data1}, (err, data2) => {
                if(err){console.log(err); return}
    
                res.status(200).send({location: data2.Location, Key: data2.Key})
    
            })
        })
    }
   
})

app.get("/api/location/:location", (req, res) => {
    fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${req.params.location}&key=AIzaSyBoTYIDW7jaod1TCyCqT7wgBjD9262rN5k`)
    .then(res2 => res2.json())
    .then(json => {res.status(200).send(json)})
})

app.post("/api/postgame", (req, res) => {
    sequelize.query(`INSERT INTO games (name, image, bucket_id, location) VALUES ('${req.body.name}', '${req.body.picture}', '${req.body.uuid}', '${req.body.location}')`)
    .then(() => {
        for(let i = 0; i < req.body.genres.length; i++){
            sequelize.query(`INSERT INTO genre_game (genre_id, game_id) VALUES ((SELECT id FROM genres WHERE genre = '${req.body.genres[i]}'), (SELECT id FROM games WHERE bucket_id = '${req.body.uuid}'))`)
        }
    })
})

app.listen(process.env.PORT || 3001)