async function findByQuery(queryObject) {
    let response = await fetch("/common/findByQuery",{
        method: "POST",
        //credentials: 'same-origin',
        //mode: 'no-cors',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(queryObject),
        //body: finalArray,
    });
  
    let data = await response.json();
  
    return data;
  };
async function findObjByQuery(queryObject) {
    let response = await fetch("/common/findObjByQuery",{
        method: "POST",
        //credentials: 'same-origin',
        //mode: 'no-cors',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(queryObject),
        //body: finalArray,
    });
  
    let data = await response.json();
  
    return data;
  };

  