const express = require('express');
const app  = express();
const mg = require('mongoose');
const cors = require('cors');

app.use(cors());
app.use(express.json())

mg.connect('mongodb://127.0.0.1:27017/rdb')
.then(()=>console.log('connected'))
.catch((e)=>console.log(e));

const sc = new mg.Schema({
    username : {
        type:String,
        required : true
    }
});

const rusers = mg.model('rusers',sc);

app.post('/insert',async(req,res)=>{
    try{
    var u = req.body.username;
    var r = await rusers.insertOne({username:u});
    console.log(r+'saved successfully');
    res.send();
    }catch(e){
        console.log('cant save' + e);
        res.send();
    }
});

app.listen(5500,()=>{
    console.log('listening to http:localhost:5500');
})