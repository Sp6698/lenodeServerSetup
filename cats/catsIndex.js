const express=require('express')
const router=express.Router()
console.log('hello')

router.get("/",(req,res)=>{
    res.sendFile(__dirname+"/catsIndex.html")
})

module.exports = router;