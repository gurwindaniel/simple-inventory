const express=require('express')
const app=express()
const port =process.env.PORT || 3000
const {Pool}=require('pg')
require('dotenv').config()
const bodyparser=require('body-parser')
//EJS TEMPLATE
app.set('view engine','ejs')

// const pool=new Pool({
//     user:'postgres',
//    host:'localhost',
//    database : 'inventory_2',
//    password:'Trogen@2023'
// })

//cloud connection string

const pool=new Pool({
    connectionString:process.env.CONNECTION_STRING
})

//middleware
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())
app.use('/public',express.static('public'))
//Home page
app.get('/',async(req,res)=>{
    try{

       res.render('home')
    }
    catch(e){
        console.log(`Error in getting a page ${e}`)
    }
})

//customer page
app.get('/customer',async(req,res)=>{
    try{

       res.render('customer')
    }
    catch(e){
        console.log(`Error in getting a page ${e}`)
    }
})

app.get('/cust',async(req,res)=>{
    const client=await pool.connect()
    try{
        const value = await client.query('SELECT * from customer')
        console.log(value.rows)
        res.send(value.rows).status(200)
    }catch(e){

    }finally{
        client.release()
    }
})

//post route

app.post('/custpost',async(req,res)=>{

    const client=await pool.connect()
    console.log(req.body)
    try{

 await client.query('insert into customer (customer_name,age,email) values ($1,$2,$3)',[req.body.customer_name,req.body.age,req.body.email])
        res.send(req.body).status(200)
    }catch(e){
        console.log(e)
    }finally{
        client.release()
    }
})

//delete
app.delete('/custdelete:id',async(req,res)=>{
    const client =await pool.connect()
    try{

       
        const id=req.params.id.split(':')[1]
       
        if(id.split(',').length==1)
        {

            deletequery='delete from customer where customer_id=$1'
            await client.query(deletequery,[id])
        }
        else if(id.split(',').length>1)
        {
            deletequery='delete from customer where customer_id=any($1)'
            await client.query(deletequery,[id.split(',')])

        }
    }catch(e){

    }finally{
        client.release()
    }
})

//edit using customer post
app.post('/custpatch',async(req,res)=>{

    const {customer_id,customer_name,age,email} =req.body
    const client = await pool.connect()
    try{
       const result= await client.query('select updatecust($1,$2,$3,$4)',[customer_id,customer_name,age,email])
    //    console.log(result.rows)
        res.send(req.body).status(200)
    }catch(e){
        console.error(`custpatch error ${e}`)
    }finally{
        client.release()
    }
})

app.listen(port,()=>{
    console.log(`listening to the port no ${port}`)
})