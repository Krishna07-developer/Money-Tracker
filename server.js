const express = require("express")
const dotenv = require("dotenv").config()
const Transaction = require("./model/transactions.js");
const mongoose = require("mongoose")
const ejs = require("ejs")

const app = express();

//Middleware
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.set("view engine" , 'ejs');
app.use(express.static('public'));



mongoose.connect(process.env.CONNECT_SERVER).then(()=>{
    console.log('Database Connected!')
}).catch(()=>{
    console.log('Error occurred at database');
})



app.get("/" , async(req,res)=>{
    const datatransaction = await Transaction.find()
    res.render('index' , {datatransaction})
})



app.get("/new" , (req,res)=>{
    res.render("new")
})
app.post("/new" , async(req,res)=>{
    const createdData = await new Transaction({
        description : req.body.description,
        amount : req.body.amount,
        type : req.body.type
    })

    await createdData.save().then(()=>{
        res.redirect("/")
    })


})


app.get("/delete/:id" , async(req,res)=>{
    await Transaction.findByIdAndDelete({_id : req.params.id});

    await res.redirect("/")
});



app.get("/edit/:id" , async(req,res)=>{
    const transactionId = req.params.id;

    const editone = await Transaction.findOne({_id : transactionId})

    await res.render("edit" , {editone})

    
})


app.post("/edit/:id" , async(req,res)=>{
    const transactionId = req.params.id;

    await Transaction.findByIdAndUpdate({_id : transactionId} , {description : req.body.description , amount : req.body.amount , type : req.body.type} , {new : true});
    await res.redirect("/")
})


const port = process.env.PORT || 8001

app.listen(port,()=>{
    console.log('Running on port' , port);
})