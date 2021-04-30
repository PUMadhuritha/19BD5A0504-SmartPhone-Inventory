const express=require('express')
const app=express()
const bodyParser=require('body-parser')
const MongoClient=require('mongodb').MongoClient

var db;
var s;
var s1;

MongoClient.connect('mongodb://localhost:27017/App_data',(err,database) => {
    if(err) return console.log(err)
    db=database.db('App_data')
    app.listen(2001, () => {
        console.log('Listening at port number 2001')
    })
})

app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.static('public'))


app.get('/',(req,res) => {
    db.collection('SmartPhones').find().toArray( (err,result)=>{
        if(err) return console.log(err)
    res.render('homepageb.ejs', {data : result})
    })
})

app.get('/home',(req,res)=>{
    res.render('homepageb.ejs');
})

app.get('/create',(req,res)=>{
    res.render('add1.ejs');
})


app.get('/salesdetails',(req,res) => {
    db.collection('SmartPhones').find().toArray( (err,result)=>{
        if(err) return console.log(err)
    res.render('salesdetails.ejs', {data : result})
    })
})

app.get('/updateproduct',(req,res)=>{
    res.render('update1.ejs');
})

app.get('/deleteproduct',(req,res)=>{
    res.render('delete1.ejs');
})


app.post('/AddData',(req,res)=>{
    db.collection('SmartPhones').save(req.body),(err,result)=>{
        if(err) return console.log(err)
    res.redirect('/')
    }
})


app.post('/update',(req,res)=>{
    db.collection('SmartPhones').find().toArray((err,result)=>{
    if(err) return console.log(err)
    for(var i=0;i<result.length;i++)
    {
        if(result[i].ModelName==req.body.modelname1)
        {
            s=result[i].Cost
            s1=result[i].Quantity
            break
        }
    }
    db.collection('SmartPhones').findOneAndUpdate({ModelName:req.body.modelname1},{
        $set:{Cost: parseInt(s) + parseInt(req.body.Cost)}},{sort:{_id:-1}},
        (err,result)=>{
            if(err) return res.send(err)
            console.log(req.body.modelname1+ ' cost updated')
            res.redirect('/')
        })
    })
})

app.post('/delete',(req,res)=>{
    db.collection('SmartPhones').findOneAndDelete({ModelName:req.body.modelname2},{Storage:req.body.storage2},(err,result)=>{
        if(err) return console.log(err)
        res.redirect('/')
    })
})

