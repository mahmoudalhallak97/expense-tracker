require("dotenv").config();
console.log(process.env.DB_NAME);

const express = require("express");
const cors = require("cors");
const{Pool} = require("pg");
const app =express();
app.use(cors());

const pool = new Pool({
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    host : process.env.DB_HOST,
    port : process.env.DB_PORT,
    database : process.env.DB_NAME,

})

app.get("/api/hello" , (req,res)=>{
    res.json({
        message:"hello from API"
    });
});

app.get("/api/expenses" , (req,res)=>{
    const expenses = [
        {
            id:1,
            title:"taxi",
            amount:2
        },
        {
            id:2,
            title:"food",
            amount:5
        }
    ];
    res.json(expenses);
});

app.get("/api/students", async (req,res) =>{
    const result = await pool.query("SELECT * FROM students ORDER BY id");
    res.json(result.rows);
});

app.get("/api/students/:id", async (req,res) =>{
    const id = req.params.id;

    if (isNaN(id))
    {
        return res.status(404).json({
            message : "invalid student id, please enter a number"
        });
    }

    const result = await pool.query("SELECT * FROM students WHERE id = $1", [id]);
    if (result.rows.length === 0)
    {
        return res.status(404).json({
            message : "sorry! student not found"
        });
    }
    res.json(result.rows[0]);
});

app.listen(3000, ()=>{
    console.log("server is running on port 3000");
});