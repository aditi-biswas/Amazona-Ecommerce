import express from 'express';
import data from './data.js';
import mongoose from 'mongoose';

import seedRouter from './routes/seedRoutes.js';
import productRouter from './routes/productRoutes.js';
import userRouter from './routes/userRoutes.js';
import orderRouter from './routes/orderRoutes.js';
import dotenv from 'dotenv';

dotenv.config();//to fetch variables in env file
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    console.log('connected to db')
}).catch(err => {
    console.log(err.message)
});

const app = express();


app.use(express.json());
app.use(express.urlencoded({entended: true}));

app.get('/api/keys/paypal',(req,res)=>{
    res.send(`${process.env.PAYPAL_CLIENT_ID}` || 'sb');
})


app.use('/api/seed', seedRouter); // done st begining of application when we 1st go to '/' route as we defined it to '/' seedRoutes.js
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);

// app.get('/api/products', (req,res) => {
//     res.send(data.products);
// });

// app.get('/api/products/slug/:slug',(req,res)=>{
//     const product= data.products.find(x=> x.slug===req.params.slug);
//     if(product){
//         res.send(product);
//     }
//     else{
//         res.status(404).send({message:'Product Not Found'});
//     }
// })

// app.get('/api/products/:id',(req,res)=>{
//     const product= data.products.find((x) => x._id===req.params.id);
//     if(product){
//         res.send(product);
//     }
//     else{
//         res.status(404).send({message:'Product Not Found'});
//     }
// })



app.use((err,req,res,next)=>{// inside expressAsyncHandler if there is error this middleware will run and the error msg will be returned to their user
    res.status(500).send({message: err.message});
});  //to handle errors in server

const port = process.env.PORT || 5000; //if process.env.PORT not available then selct port 5000
app.listen(port,()=>{
    console.log(`serve at http://localhost:${port}`);
});

//when you run server.js 1st products will not be shown once load localhost:5000/api/seed then reload the website page then products will be shown