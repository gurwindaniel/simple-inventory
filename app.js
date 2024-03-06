const express=require('express')
const session = require('express-session');
const app=express()
const port =process.env.PORT || 3000
const {Pool}=require('pg')
require('dotenv').config()
const bodyparser=require('body-parser')
const bcryptjs=require('bcryptjs')
const passport=require('passport')
const LocalStrategy=require('passport-local').Strategy;
const flash=require('connect-flash')
const obj=require('./middleware/auth')

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(flash())
  async function mystrategy(email,password,done){
    const client =await pool.connect()
    try{
        await client.query('select * from users where email=$1',[email] , 
          
        // query function start
       async function(err,res){
            if(err){
                  return done(err)
            }
            if(res.rows[0]==null){
                console.log("incorrect user name")
                return done(null,false,{message:"Incorrect User Name"})
           }
        await bcryptjs.compare(password,res.rows[0].password,
            // error comparing 
            function(err,ismatch){
              if(err){
                  throw err
              }
               else if(ismatch){
                   console.log(ismatch)
                   console.log(res.rows)
                    return done(null,res.rows[0])
                }else{
                    return done(null, false, {message:'Incorrect Password'})
                }               
            }//error comparing function end           
            )
        }) }catch(e){console.log(e)}finally{client.release()}
}

  passport.use('local',new LocalStrategy({usernameField:'email',passwordField:'password'},mystrategy))
//Serialize user
passport.serializeUser((user,done)=>{done(null,user.user_id)

})

//deserialize user
passport.deserializeUser(async(user_id,done)=>{
const client=await pool.connect();

try{
await client.query('select * from users where user_id=$1',[user_id],function(err,res){
 if(err){throw err}
 else{
  return done(err,res.rows[0])
 }
 
})
}catch(e){

}finally{
client.release();
}

})     //deserialize end
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

       res.render('login')
    }
    catch(e){
        console.log(`Error in getting a page ${e}`)
    }
})
app.get('/home',obj.auth,async(req,res)=>{
    try{
        res.render('home')
    }catch{

    }
})
//customer page
app.get('/customer',obj.auth,async(req,res)=>{
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

app.get('/user',obj.auth,async(req,res)=>{

const client = await pool.connect()
    
    try{

       const role_name= await client.query('select role_name from roles')
       console.log(role_name.rows)
        res.render('userform',{role:role_name.rows})
    }catch(e){

    }finally{

    }
})

//post user

app.post('/userpost',async(req,res)=>{
    const client = await pool.connect()
    const hashed_password=await bcryptjs.hash(req.body.password,10)
    
    console.log(req.body)
    try{
        const email_check=await client.query('select duplicate_email($1)',[req.body.email])
        // console.log(email_check.rows[0].duplicate_email)
        console.log(req.body.role_name)
        if(!email_check.rows[0].duplicate_email)
        {
            const rolename=await client.query('select role_id from roles where role_name =$1',[req.body.role_name])
            console.log(rolename.rows[0].role_id)
            await client.query('INSERT INTO users (name,email,role_id,password) values ($1,$2,$3,$4)',[req.body.name,req.body.email,rolename.rows[0].role_id,hashed_password])
        }
    }catch(e){
        console.log(e)
    }finally{
client.release()
    }
})

//login post
app.post('/loginpost',passport.authenticate('local',{
    successRedirect:'/home',
    failureRedirect:'/',
    failureFlash:true
}));
app.listen(port,()=>{
    console.log(`listening to the port no ${port}`)
})