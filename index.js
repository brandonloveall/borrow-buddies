require("dotenv").config()
const axios = require("axios")
const express = require("express")
const app = express()
const path = require("path")
const cors = require("cors")
const {Sequelize} = require("sequelize")
const AWS = require("aws-sdk")
const fileUpload = require("express-fileupload")
const bcrypt = require("bcryptjs")
let fs = require("fs")
let s3 = new AWS.S3({params: {Bucket: "borrowbuddies"}})
const {v4} = require("uuid")
const { send } = require("process")
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


//SERVE SITE
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"))
})

app.get("/c/*", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"))
})


//SET IMAGE DURING GAME POSTING
app.post("/api/setimg", (req, res) => {
    const key = v4()

    if(!req.query.prev){
        fs.readFile(req.files.image.tempFilePath, (err, data1) => {
            if(err){console.log(err); return}
            
            s3.upload({Bucket: "borrowbuddies", Key: key, Body: data1}, (err, data2) => {
                if(err){console.log(err); return}
    
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


//GET LOCATION INFO
app.get("/api/location/:location", (req, res) => {
    fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${req.params.location}&key=AIzaSyBoTYIDW7jaod1TCyCqT7wgBjD9262rN5k`)
    .then(res2 => res2.json())
    .then(json => {res.status(200).send(json)})
})


//POST GAME TO DB
app.post("/api/postgame", (req, res) => {
    sequelize.query(`INSERT INTO games (name, image, bucket_id, location, user_uuid) VALUES ('${req.body.name}', '${req.body.picture}', '${req.body.uuid}', '${req.body.location}', '${req.body.user_uuid}')`)
    .then(() => {
        for(let i = 0; i < req.body.genres.length; i++){
            sequelize.query(`INSERT INTO genre_game (genre_id, game_id) VALUES ((SELECT id FROM genres WHERE genre = '${req.body.genres[i]}'), (SELECT id FROM games WHERE bucket_id = '${req.body.uuid}'))`)
            .then(() => {
                sequelize.query(`SELECT id FROM games WHERE bucket_id = '${req.body.uuid}'`)
                .then(dbRes2 => {res.status(200).send(dbRes2[0].id)})
            })
        }
    })
})

app.post("/api/signup", (req, res) => {
    sequelize.query(`SELECT * FROM users WHERE username = '${req.query.username}'`)
    .then((dbRes) => {
        if(dbRes[0].length === 0){
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(req.query.password, salt, (err2, result) => {
                    if(err){console.log(err); return}
                    sequelize.query(`INSERT INTO users (username, password, phone_number) VALUES ('${req.query.username}', '${result}', '${req.query.phonenumber}')`)
                    .then(sequelize.query(`SELECT id, username FROM users WHERE username = '${req.query.username}'`).then((dbRes2 => {res.status(200).send(dbRes2[0])})))
                })
            })
        }
        else{
            res.status(200).send("user already exists")
        }
    })
})

app.get("/api/login", (req, res) => {
    sequelize.query(`SELECT password FROM users WHERE username = '${req.query.username}'`)
    .then((dbRes) => {
        if(dbRes[0].length === 0){res.status(200).send(false); return}

        bcrypt.compare(req.query.password, dbRes[0][0].password, (err, result) => {
            if(err){console.log(err); return}
            if(!result){res.status(200).send(false)}

            sequelize.query(`SELECT id, username FROM users WHERE username = '${req.query.username}'`)
            .then((dbRes2) => {
                res.status(200).send(dbRes2[0][0])
            })
        })
    })
})

app.get("/api/gamesearch", (req, res) => {
    let keys = Object.keys(req.query)
    let query = `${req.query[keys[0]] && req.query[keys[0]] !== "null" ? `WHERE ${keys[0]} LIKE '%${req.query[keys[0]]}%'` : ""}${req.query[keys[1]] !== "null" && req.query[keys[1]] ? ` AND ${keys[1]} LIKE '%${req.query[keys[1]]}%'` : ""}${req.query[keys[2]] !== "null" && req.query[keys[2]] !== undefined ? ` AND ${keys[2]} LIKE '%${req.query[keys[2]]}%'` : ""}`

    sequelize.query(`
        SELECT COUNT(DISTINCT games.id)
        FROM games 
        JOIN genre_game ON games.id = genre_game.game_id 
        JOIN genres ON genre_game.genre_id = genres.id 
        ${query};

        SELECT DISTINCT games.id, games.name, image, location, user_uuid 
        FROM games 
        JOIN genre_game ON games.id = genre_game.game_id 
        JOIN genres ON genre_game.genre_id = genres.id 
        ${query}
        ORDER BY name, games.id, image, location, user_uuid 
        LIMIT 10 ${req.query.page ? `OFFSET ${(req.query.page - 1) * 10}` : ""}`)
        .then(dbRes => {
            res.status(200).send(dbRes[0])
        })
})

app.post("/api/gamerequest", (req, res) => {

    sequelize.query(`
    INSERT INTO game_requester (requester_id, game_id) 
    SELECT '${req.query.requesterid}', '${req.query.gameid}'
    WHERE
        NOT EXISTS (
            SELECT id FROM game_requester 
            WHERE requester_id = '${req.query.requesterid}' 
            AND game_id = '${req.query.gameid}'
        )
    `)
    .then(dbRes => {res.status(200).send()})
})

app.get("/api/usergames/:id", (req, res) => {
    sequelize.query(`
        SELECT COUNT(DISTINCT games.id)
        FROM games 
        WHERE user_uuid = '${req.params.id}';

        SELECT DISTINCT games.id, games.name, image, location
        FROM games
        WHERE user_uuid = '${req.params.id}'
        ORDER BY games.name, games.id, image, location 
        LIMIT 10 ${req.query.page ? `OFFSET ${(req.query.page - 1) * 10}` : ""}
    `)
    .then(dbRes => {res.status(200).send(dbRes[0])})
})

app.delete("/api/usergames/:userid", (req, res) => {
    sequelize.query(`
        DELETE FROM games 
        WHERE user_uuid = '${req.params.userid}' AND id = ${req.query.gameid}
    `)
    .then(dbRes => {res.status(200).send()})
})

app.get("/api/alerts/:id", (req, res) => {
    sequelize.query(`
        SELECT COUNT(game_id)
        FROM game_requester
        JOIN games ON game_id = games.id
        JOIN users ON users.id = games.user_uuid
        WHERE users.id = '${req.params.id}';
    `)
    .then(dbRes => {res.status(200).send(dbRes[0])})
})

app.listen(process.env.PORT || 3001)