const express=require('express')
const app=express();
const commonRouter = require('./common');
const studentsRouter=require('./students/studentIndex')
const catsRouter=require('./cats/catsIndex')
const fileUploadRouter=require('./fileUplodToserver/fileUploadToServer')

let port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req,res,next)=>{
    req.customProperty = "ABCD";
    next();
})

app.get("/", function (req, res, next) {
    console.log("/ route",req.customProperty);
    res.sendFile(__dirname + "/index.html");
});


app.use('/common',commonRouter);
app.use('/students',studentsRouter)
app.use('/cats',catsRouter)
app.use('/fileUplodToserver',fileUploadRouter)
// google this what does this mean
app.use(express.static('public'));

app.listen(port,()=>console.log(`Server Started http://localhost:${port}`))