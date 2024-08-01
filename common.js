//Trial Back End Javascript
const express = require("express");
const router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const client = new MongoClient(url);
const parameters = require("./parameters");
const url = parameters.url
const mydb = parameters.mydb

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

router.get("/catsdata", async (req, res) => {
    try {
        fetch('https://api.thecatapi.com/v1/breeds', {
        })
            .then((response) => response.json())
            .then((result) => {
                res.json(result)
            })
    } catch (error) {
        console.error(error)
    }
})

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

router.post("/findByQuery", async (req, res) => {

    const requestObject = req.body;

    // const client = new MongoClient(url);
    try {
        const client = await MongoClient.connect(url);

        const myCollection = client.db('bhavani').collection(requestObject.collection);

        const query = requestObject.query != undefined ? requestObject.query : {};
        const queryOptions = requestObject.queryOptions != undefined ? requestObject.queryOptions : {}
        const sort = requestObject.sort != undefined ? requestObject.sort : {};
        const limit = requestObject.limit != undefined ? requestObject.limit : Number.MAX_SAFE_INTEGER;

        const data = await myCollection.find(query, queryOptions).sort(sort).limit(limit).toArray();
        // console.log(data)

        console.log(`data fetched from /common/findByQuery from collection ${requestObject.collection}`);
        // await client.close();
        res.json(data);

    } catch (error) {
        console.log(error)
    }
    finally {
        client.close()
    }
});

router.post("/findObjByQuery", async (req, res) => {

    const requestObject = req.body;

    // const client = new MongoClient(url);
    try {
        const client = await MongoClient.connect(url);

        const myCollection = client.db('bhavani').collection(requestObject.collection);

        const query = requestObject.query != undefined ? requestObject.query : {};
        const queryOptions = requestObject.queryOptions != undefined ? requestObject.queryOptions : {}
        const sort = requestObject.sort != undefined ? requestObject.sort : {};
        const limit = requestObject.limit != undefined ? requestObject.limit : Number.MAX_SAFE_INTEGER;

        const data = await myCollection.find(query, queryOptions)
        // console.log(data)

        console.log(`data fetched from /common/findObjByQuery from collection ${requestObject.collection}`);
        // await client.close();
        res.json(data);

    } catch (error) {
        console.log(error)
    }
    finally {
        client.close()
    }
});

router.post("/updateHeatDetails", async (req, res) => {
    let heatPouringQueryObj = req.body
    console.log(heatPouringQueryObj)
    // console.log("req.body=", req.body);
    // let heatNo = req.body.heatNo;
    // delete req.body.heatNo;
    try {
        let client = await MongoClient.connect(url);
        // update heatPouring document with id = heatNo with req.body
        let heatDetailsUpdateResult = await client.db('bhavani').collection("heatPouring").updateOne({
            _id: heatPouringQueryObj.heatNo,
            ladleDetailsArray: {
                $elemMatch: {
                    // ladleNo: heatPouringQueryObj.pouredLadleNo,
                    pouredItemsArray: {
                        $elemMatch: {
                            pouredLadleNo: heatPouringQueryObj.pouredLadleNo,
                            moulding_id: heatPouringQueryObj.moulding_id,
                            moulding_srNo: heatPouringQueryObj.moulding_srNo
                        }
                    }
                }
            }
        },
            {
                $set: {
                    "ladleDetailsArray.$.pouredItemsArray.$[innerElem].pouringProblem": heatPouringQueryObj.pouringProblem,
                    "ladleDetailsArray.$.pouredItemsArray.$[innerElem].pouringRemark": heatPouringQueryObj.pouringRemark,
                    "ladleDetailsArray.$.pouredItemsArray.$[innerElem].problemDescription": heatPouringQueryObj.problemDescription
                }
            },
            {
                arrayFilters: [
                    {
                        "innerElem.pouredLadleNo": heatPouringQueryObj.pouredLadleNo,
                        "innerElem.moulding_id": heatPouringQueryObj.moulding_id,
                        "innerElem.moulding_srNo": heatPouringQueryObj.moulding_srNo
                    },
                ],
            }
            //   
        );
        console.log(heatDetailsUpdateResult)
        if (heatDetailsUpdateResult.modifiedCount > 0) {
            res.send({ status: "success", message: "Data saved Successfully" });
        };
        if (heatDetailsUpdateResult.modifiedCount == 0) {
            res.send({ status: "failed", message: "Data not saved" });
        };


        client.close();

    } catch (error) {
        console.error("error", error);
        res.send({ status: "failed", message: "Data not saved" });
        client.close();
    }
});







module.exports = router