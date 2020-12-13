const express = require('express')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')

const mysql = require('mysql2/promise')

const DB_USERNAME = "root"
const DB_PASSWORD = "parola123"

let connec

mysql.createConnection({
    user : DB_USERNAME,
    password : DB_PASSWORD
})
.then((connection) => {
    connec = connection
    return connection.query('CREATE DATABASE IF NOT EXISTS tw_homework')
})
.then(() => {
    return connec.end()
})
.catch((err) => {
    console.warn(err.stack)
})

const sequelize = new Sequelize('tw_homework', DB_USERNAME, DB_PASSWORD,{
    dialect : 'mysql',
    logging: false
})

const app = express()


app.use(express.json()); 


app.get('/create', async (req, res) => {
    try{
        await sequelize.sync({force : true})
        for (let i = 0; i < 10; i++){
            let foodItem = new FoodItem({
                name: 'name ' + i,
                category: ['MEAT', 'DAIRY', 'VEGETABLE'][Math.floor(Math.random() * 3)],
                calories : 30 + i
            })
            await foodItem.save()
        }
        res.status(201).json({message : 'created'})
    }
    catch(err){
        console.warn(err.stack)
        res.status(500).json({message : 'server error'})
    }
})

app.get('/food-items', async (req, res) => {
    try{
        let foodItems = await FoodItem.findAll()
        res.status(200).json(foodItems)
    }
    catch(err){
        console.warn(err.stack)
        res.status(500).json({message : 'server error'})        
    }
})

app.post('/food-items', async (req, res) => {
    
    try{
        var stats, mess;
        if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
            stats = 400;
            mess = 'body is missing';
       }
       
       else
       
       if(req.body.name === undefined ||  req.body.category === undefined || req.body.calories === undefined) 
       { stats = 400;
         mess = 'malformed request';
       }
       else
        
        if(req.body.calories <0)
        { stats = 400;
          mess = 'calories should be a positive number';
        }
        else

        if (req.body.category.length <3 || req.body.category.length >10)
        {stats = 400;
         mess = 'not a valid category';
        }
        else
        {
        stats=201;
        mess='created'
        }
    
        
         res.status(stats).json({message: mess});
        
    }

    catch(err){
       res.status(stats).json({message : mess}) 
    }
})

module.exports = app