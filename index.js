require("dotenv").config()
const express = require("express")
const app = express()
const path = require("path")
const cors = require("cors")
const {Sequelize} = require("sequelize")
const sequelize= new Sequelize(process.env.DATABASE_URL, {
        dialect: "postgres",
        dialectOptions: {
            ssl: {
                rejectUnauthorized: false
            }
        }
})



app.use(express.static(path.join(__dirname, "build")))
app.use(cors())
app.use(express.json)

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname), "build", "index.html")
})

app.get("/c/*", (req, res) => {
    res.sendFile(path.join(__dirname), "build", "index.html")
})

app.listen(process.env.PORT || 3001)