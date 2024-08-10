

console.log("Hello")
// document.getElementById('convertBtn').addEventListener('click', async (event) => {
//     // clean up earliest files
//     let myFiles = {}
//     // set state of files to false until each of them is processed
//     isFilesReady = false
  
//     // const files = event.target.files;
//     let files = document.getElementById('fileInput').files[0];
//     console.log(files)
//     const filePromises = Object.entries(files).map(item => {
//       return new Promise((resolve, reject) => {
//         const [index, file] = item
//         const reader = new FileReader();
//         reader.readAsArrayBuffer(file);
//         reader.onload = function(event) {
//           // Convert file to Base64 string
//           // btoa is built int javascript function for base64 encoding
//           myFiles['picture'] = btoa(event.target.result)
//           console.log("myFiles",myFiles)
//           resolve()
//         };
//         reader.onerror = function() {
//           console.log("can't read the file");
//           reject()
//         };
//       })
//     })
//   console.log(filePromises)
//     Promise.all(filePromises)
//       .then(() => {
//         console.log('ready to submit')
//         isFilesReady = true
//       })
//       .catch((error) => {
//         console.log(error)
//         console.log('something wrong happened')
//       })
//   })
// document.getElementById('convertBtn').addEventListener('click', async function (event) {
//     let fileInput = document.getElementById('fileInput').files[0];
//     let base64Output = document.getElementById('base64Output');
//     console.log(fileInput)
//     if (fileInput) {
//         let reader = new FileReader();
//         let binaryString = ''
        
//         reader.readAsArrayBuffer(fileInput)
        
//         reader.loadend = function (){
//             binaryString = this.result;
//             console.log('binary string', binaryString);
//         }
         
//         return;

//         reader.onload = async function (event) {
//             console.log(reader.result)
//             // let fileBinaryData = btoa(event.target.result);
//             // console.log(fileBinaryData)
//             // return
//             let uploadObj = {
//                 cardAndTableToken: '"card"="98ce701a74070049ef6500fa4d14f8edf9d2046a", "table"="9ab92a125aef1c6ce908562e679647cf8bfe4e89"',
//                 expensesheetnumber: 10000187,
//                 rowNumber: 2,
//                 fileBinaryData: reader.result,
//                 fileName: fileInput.name
//                 // x_reconnect
//             }
//             try {
//                 // Send POST request with Base64 encoded data
//                 const response = await fetch('/fileUplodToserver/fileUplodToserverApi', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json'
//                     },
//                     body: JSON.stringify(uploadObj)
//                 });

//                 const data = await response.json();
//                 console.log('File uploaded successfully:', data);
//                 alert(data.message)
//             } catch (error) {
//                 console.error('Error uploading file:', error);
//             }
//         };

//         reader.readAsDataURL(fileInput);
//     } else {
//         alert('Please select a file first!');
//     }
// });
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
document.getElementById('convertBtn').addEventListener('click', async function () {
    let fileInput = document.getElementById('fileInput').files[0];
    console.log(fileInput)
    if (fileInput) {
        let reader = new FileReader();

        reader.onload = async function (event) {
            let fileBinaryData = btoa(event.target.result);
            console.log(fileBinaryData)
            // return
            let uploadObj = {
                cardAndTableToken: '"card"="dbf4484b651d8b1a8c3c5003d7c3b7c6bbcd0d3d", "table"="b7304e07dd52610ca960f638d17775350a743e3e"',
                expensesheetnumber: 10000187,
                rowNumber: 3,
                fileBinaryData: fileBinaryData,
                fileName: fileInput.name
                // x_reconnect
            }
            try {
                // Send POST request with Base64 encoded data
                const response = await fetch('/fileUplodToserver/fileUplodToserverApi', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(uploadObj)
                });

                const data = await response.json();
                console.log('File uploaded successfully:', data);
                alert(data.message)
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        };

        reader.readAsDataURL(fileInput);
    } else {
        alert('Please select a file first!');
    }
});


// cardAndTableToken
// expensesheetnumber
// rowNumber
// fileBinaryData
// fileName
// x_reconnect