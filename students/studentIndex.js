const express=require('express')
const router=express.Router()
console.log('hello')

router.get("/",(req,res)=>{
    res.sendFile(__dirname+"/studentIndex.html")
})

module.exports = router;