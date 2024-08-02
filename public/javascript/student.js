
let studentList = document.getElementById('studentList')
studentList.style.display = 'block'
let addStudent = document.getElementById('addStudent')
addStudent.style.display = 'none'

let studentArray = []
// let updatebtn = document.getElementById('updatebtn')
// updatebtn.style.display = 'none'

fetch(`/common/all/${'student'}`)
    .then((response) => response.json())
    .then((result) => {
        studentArray = result
        let studentFilterArray=studentArray.filter((el)=>el._id!=0)
        console.log(result);
        let tbody = document.querySelector('#studentTbody')
        studentFilterArray.forEach((res, i) => {
            // console.log(res);
            let tableRow = document.createElement('tr')
            let tdid = document.createElement('td')
            tdid.innerHTML = res._id
            let tdName = document.createElement('td')
            tdName.innerHTML = res.name
            let tdage = document.createElement('td')
            tdage.innerHTML = res.age
            let tdStd = document.createElement('td')
            tdStd.innerHTML = res.standard
            // fee_status
            let tdFee = document.createElement('td')
            if (res.fee_status) {
                tdFee.innerHTML = "paid"
            } else {
                tdFee.innerHTML = "pending"
            }   
            let tdAction = document.createElement('td')
            tdAction.innerHTML = `<button type='submit' class='btn btn-primary'onclick="editStudentData(${res._id})">Edit</button>
              <button type='button' class='btn btn-primary' onclick="deleteStudentData(${res._id})">Delete</button>`
            tableRow.append(tdid, tdName, tdage, tdStd, tdFee, tdAction)
            tbody.append(tableRow)
        })
        document.getElementById("loaderDiv").style.display = "none";
    });

function addNewStd() {
    clearAllFeildsInAddDiv()
    studentList.style.display = 'none'
    addStudent.style.display = 'block'
    let updatebtn = document.getElementById('updatebtn')
    let submitbtn = document.getElementById('submitbtn')
    updatebtn.style.display = 'none'
    submitbtn.style.display = 'block'
    let header = document.getElementById('header')
    header.innerHTML = 'Add New Student'
    let id = document.getElementById('id')
    let idObj= studentArray.find((el)=>el._id==0)
        id.value = idObj.sequenceValue + 1
    id.disabled=true
}

function studentListFn() {
    studentList.style.display = 'block'
    addStudent.style.display = 'none'
}





function editStudentData(data) {
    // console.log(studentArray[data])
    insertDataInField(studentArray.find((el)=>el._id==data))
}
function clearAllFeildsInAddDiv(){
  let all = document.querySelectorAll("#addStudent input");
  for (let el of all) { el.value= ""; }
  console.log(all)
}
function insertDataInField(data) {
    console.log(data)
    studentList.style.display = 'none'
    addStudent.style.display = 'block'
    let submitbtn = document.getElementById('submitbtn')
    submitbtn.style.display = 'none'
    let updatebtn = document.getElementById('updatebtn')
    updatebtn.style.display = 'block'
    let header = document.getElementById('header')
    header.innerHTML = 'Update Student Data'


    let id = document.getElementById('id')
    id.value = data._id
    id.disabled = true;
    // id.setAttribute('disabled')
    let name = document.getElementById('name')
    name.value = data.name
    let age = document.getElementById('age')
    age.value = data.age
    let standard = document.getElementById('standard')
    standard.value = data.standard
    let fee_status = document.getElementById('fee_status')
    // console.log(data.fee_status)
    if (data.fee_status) {
        fee_status.value = "paid"
    } else {
        fee_status.value = "pending"
    }
}

function updateStudentData() {
    let data = getDataFromField()
    console.log(data)
    document.getElementById("loaderDiv").style.display = "none";
    fetch("/common/update/student", {
        method: "POST",

        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    }).then((response) => response.json())
        .then((data) => {
            console.log(data)
            console.log("Success:", data.message);
            alert(data.message);
            if (data.status == "success") {

                window.location.reload();
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });

}

function deleteStudentData(data) {
    let object = studentArray.find((el)=>el._id==data)
    console.log(object)
    
    fetch(`/common/delete/${'student'}`, {
        method: "POST",
        //credentials: 'same-origin',
        //mode: 'no-cors',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(object),
        //body: finalArray,
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("Success:", data.message);
            alert(data.message);
            if (data.status == "success") {
                window.location.reload();
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}

function saveStudentData() {
    let data = getDataFromField()
    console.log(data)
    if (data._id != "") {
        addNewStudent(data)
    } else {
        window.alert("Insert Data First")
    }

}

function getDataFromField() {
    let data = {}
    let id = document.getElementById('id')
    id.disabled = true;
    let name = document.getElementById('name')
    let age = document.getElementById('age')
    // age.defaultValue = 0
    let standard = document.getElementById('standard')
    let fee_status = document.getElementById('fee_status')
    data._id = parseInt(id.value);
    data.name = name.value;

    data.age = parseInt(age.value) || 0;
    data.standard = standard.value;
    if (fee_status.value == 'paid') {
        data.fee_status = true
    } else {
        data.fee_status = false
    }

    return data
}

function addNewStudent(data) {
    // fetch("/co")
    fetch(`/common/save/${'student'}`, {
        method: "POST",
        //credentials: 'same-origin',
        //mode: 'no-cors',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    }).then(res => res.json()).then(data => {
        alert(data.message);
        if (data.status == "success") {
            window.location.reload();
        }
    }).catch(err => {
        console.log(err);
    })
}
