//Trial Back End Javascript
const express = require("express");
const router = express.Router();
require('dotenv').config()
const url = process.env.DB_URL;
const mydb = process.env.DB_NAME;
const MongoClient = require("mongodb").MongoClient;
const client = new MongoClient(url);

router.get("/all/:myCollection", async (req, res) => {

    // const client = new MongoClient(url)
    let myCollection = req.params.myCollection;
    // console.log("req  ", req);

    try {
        await client.connect();
        // const client =  await MongoClient.connect(url);
        const result = await client.db(mydb).collection(myCollection).find({}).sort({ _id: 1 }).toArray()
        res.json(result);

    } catch (error) {
        console.error(error)
    }
    finally {
        client.close()
    }
});


router.post("/update/:myCollection", async (req, res) => {
    let myCollection = req.params.myCollection;
    let myObj = req.body;
    // console.log(myCollection,myObj)

    try {
        const client = await MongoClient.connect(url);

        const seqValueUpdate = await client.db(mydb).collection(myCollection).updateOne({
            _id: myObj._id
        }, { $set: { name: myObj.name, age: myObj.age, standard: myObj.standard, fee_status: myObj.fee_status } })
        // const seqValueUpdate = await client.db(mydb).collection(myCollection).updateOne({
        //     _id:myObj._id},{$set: { name: myObj.name,age:myObj.age,standard:myObj.standard,fee_status:myObj.fee_status }})
        console.log(`${seqValueUpdate.modifiedCount} document updated`)
        // await client.close();
        if (seqValueUpdate.acknowledged) {
            res.json({ status: "success", message: `data updated successfully at record no.${myObj._id}` });
            return
        }
        res.json({ status: "failed", message: `Error While Updating Data - Kindly Try Again` });

    } catch (error) {
        console.log(error)
        res.json({ status: "failed", message: `Error While Updating Data - Kindly Try Again` });
    }
    finally {
        client.close()
    }
})

router.post("/save/:myCollection", async (req, res) => {
    let myCollection = req.params.myCollection;
    let myObj = req.body;
    console.log("At backend data is:", myObj);
    // delete myObj.myCollection;
    // const client = new MongoClient(url)
    //////////////////////////////////////////
    try {
        const client = await MongoClient.connect(url);
        const seqValueUpdate = await client.db(mydb).collection(myCollection).updateOne({
            _id: 0
        }, { $inc: { sequenceValue: 1 } })
        console.log("seqValueUpdate", seqValueUpdate)
        const insertData = await client.db(mydb).collection(myCollection).insertOne(myObj)
        console.log(`document inserted at :${insertData}`)
        // await client.close();
        if (insertData.acknowledged) {
            res.json({ status: "success", message: `data saved successfully at record no.${myObj._id}` });
            return
        }

        res.json({ status: "failed", message: `Error While Saving Data - Kindly Try Again` });


    } catch (error) {
        console.log(error)
        res.json({ status: "failed", message: `Error While Saving Data - Kindly Try Again` });
    }
    finally {
        client.close()
    }
});

router.post("/delete/:myCollection", async (req, res) => {
    let myCollection = req.params.myCollection;
    let myObj = req.body;
    // let header = req.headers;
    // console.log(req.headers);
    let myModifyId = parseInt(myObj._id);
    if (myModifyId==0) {
        res.json({ status: "failed", message: `Error While Deleting Data - Kindly Try Again` });
        return
    }
    console.log(myModifyId, typeof (myModifyId))
    console.log("At backend data is:", myObj);

    try {
        const client = await MongoClient.connect(url);
        
        let deleteResult = await client.db(mydb).collection(myCollection).deleteOne({ _id: myModifyId })
        console.log(deleteResult)//{ acknowledged: true, deletedCount: 0 }

        // await client.close();
        if (deleteResult.acknowledged) {
            let highestDocNoDocument = await client.db(mydb).collection(myCollection).find({}).sort({ _id: -1 }).limit(1).toArray();
            console.log("highest doc No document\n", highestDocNoDocument); 
           
            let newSequenceValue = highestDocNoDocument.length > 0 ? highestDocNoDocument[0]._id : 0;
          
            let updateSequenceValueResult = await client.db(mydb).collection(myCollection).updateOne(
                { _id: 0 },
                { $set: { sequenceValue: newSequenceValue } }
                
            );
            console.log("Sequence value decreased", updateSequenceValueResult.modifiedCount)
            res.json({ status: "success", message: `data deleted successfully at record no ${myModifyId}`, });
            return
        }
        res.json({ status: "failed", message: `Error While Deleting Data - Kindly Try Again` });


    } catch (error) {
        console.log(error)
        res.json({ status: "failed", message: `Error While Deleting Data - Kindly Try Again` });
    }
    finally {
        client.close()
    }
});







module.exports = router