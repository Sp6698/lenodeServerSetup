
let catsList=document.getElementById('catsList')
catsList.style.display='block'
let detailsdiv=document.getElementById('detailsdiv')
detailsdiv.style.display='none'


fetch("/common/catsdata", {
    
})
    .then((response) => response.json())
    .then((result) => {
        studentArray = result
        console.log(result);
        
        let tbody = document.querySelector('#catsTableBody')
        result.forEach((res, i) => {
            console.log(res);
            let tableRow = document.createElement('tr')
            let tdid = document.createElement('td')
            tdid.innerHTML = res.id
            let tdName = document.createElement('td')
            tdName.innerHTML = res.name
            let tdLifeSpan = document.createElement('td')
            tdLifeSpan.innerHTML = res.life_span
            let tdorigin = document.createElement('td')
            tdorigin.innerHTML = res.origin
            // fee_status
            let energy_level = document.createElement('td')
            energy_level.innerHTML=res.energy_level
           
            tableRow.append(tdid, tdName, tdLifeSpan, tdorigin, energy_level)
            tbody.append(tableRow)
        })

    });