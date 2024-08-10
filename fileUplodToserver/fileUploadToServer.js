
const express = require('express')
const router = express.Router()
const fs = require('fs');

router.get("/", (req, res) => {
    res.sendFile(__dirname + "/fileUplodToserver.html")
})

router.post("/fileUplodToserverApi", async (req, res) => {

    try {
        // req body format {filName, fileBinaryData}
        let myObj = req.body;
        let binaryResponse = new Blob(myObj.fileBinaryData);
        console.log('binary response',binaryResponse);
        console.log('binary response length',binaryResponse.length);
        // let fileBinaryData = Buffer.from(myObj.fileBinaryData, 'base64');
        // let fileBinaryData = atob(myObj.fileBinaryData);
        // console.log("fileBinaryData in binary form of frontend",fileBinaryData.length)
        // Replace 'path/to/your/file.pdf' with the actual path to your PDF file
        const pdfFilePath = "uberbill1.png";

        // Read the PDF file as binary data
        const binaryData = fs.readFileSync(pdfFilePath);

        console.log('Binary Data Length:', binaryData.length); // Length of the binary data
        console.log('Binary Data: of backend', binaryData); // The binary data itself (this will be a long output!)
        
        // return;
        let newLocationResponse = await fetch("https://med72037-api.deltekfirst.com/filedrop/v1/md72037/new", {
            method: 'post',
            headers: {
                // 'Authorization': `X-Reconnect ${x_reconnect}`,
                'Authorization': 'Basic RGlrc2hhIEtlbHVza2FyOk1KU0AyMDI0',
            }
        })
        // 201 code for created 
        if (!newLocationResponse.ok) {
            let newLocationResponseData = await newLocationResponse.json();
            console.log("newLocationResponseData error", newLocationResponseData)
            res.json({ status: "failed", message: newLocationResponseData.errorMessage });
            return;
        }

        let newLocationResponseData = await newLocationResponse.json();
        console.log("newLocation URL", newLocationResponseData.location)
        let newLocationUrl = newLocationResponseData.location
        /////////////////////////////////////////////////////////////////////////////////////////////////////////
        // add attached file on that newLocationResponseD

        let fileAddedNewLocationResponse = await fetch(newLocationUrl, {
            method: 'POST',
            headers: {
                // 'Authorization': `X-Reconnect ${x_reconnect}`,
                'Authorization': 'Basic RGlrc2hhIEtlbHVza2FyOk1KU0AyMDI0',
                'Accept-Language': 'en-US',
                'Content-Type': 'application/octet-stream',
                'Content-Disposition': `attachment; filename="${myObj.fileName}"`
                // 'Content-Disposition': `attachment; filename="${pdfFilePath}"`
            },
            body: fileBinaryData, // Send the binary data
            // body: binaryData, // Send the binary data
        });

        if (fileAddedNewLocationResponse.status == 409) {
            let fileAddedNewLocationResponseData = await fileAddedNewLocationResponse.json();
            console.log('fileAddedNewLocationResponseData', fileAddedNewLocationResponseData);
            res.json({ status: "failed", message: fileAddedNewLocationResponseData.errorMessage });
            return;
        }
        // check fileAddedNewLocationResponse code 
        // if code 204 = successful
        // if code 409 = Cannot upload file. A file has already been uploaded to this file drop
        if (fileAddedNewLocationResponse.status === 204) {
            //////////////////////////////////////////////////////////////////////////////////////////////////////////
            // attach that new added document cloud location to expensesheets 
            console.log('expense sheet number', myObj.expensesheetnumber);
            console.log('rowNumber', myObj.rowNumber)

            let attachDocumentUrl = `https://med72037-api.deltekfirst.com/containers/v1/md72037/expensesheets/data;expensesheetnumber=${myObj.expensesheetnumber}/table/${myObj.rowNumber}/action;name=attachdocumenttoline`;

            let attachDocumentResponse = await fetch(attachDocumentUrl, {
                method: 'POST',
                headers: {
                    // 'Authorization': `X-Reconnect ${x_reconnect}`,
                    'Authorization': 'Basic RGlrc2hhIEtlbHVza2FyOk1KU0AyMDI0',
                    'Maconomy-Concurrency-Control': `${myObj.cardAndTableToken}`,
                    'Maconomy-File-Callback': `<${newLocationUrl}>`,
                }
            });
            console.log("attachDocumentResponse", attachDocumentResponse.ok)
            console.log('attach document to line status', attachDocumentResponse.status, attachDocumentResponse.statusText)

            if (!attachDocumentResponse.ok) {
                console.log(`Request failed with status: ${attachDocumentResponse.status}`);
                let attachDocumentResponseBody = await attachDocumentResponse.json();
                console.log('attachDocumentResponseBody :', attachDocumentResponseBody);
                res.json({ status: "failed", message: attachDocumentResponseBody.errorMessage });
                return
            }

            console.log('Request was successful', attachDocumentResponse);
            let attachDocumentResponseData = await attachDocumentResponse.json();
            console.log('attach doc response data', attachDocumentResponseData)

            res.json({ status: "success", message: `data updated successfully` });
            return;

        }

        // if code is not getting 204 & 409 mannage that condition 


    } catch (error) {
        console.log(error)
    }
});

module.exports = router;