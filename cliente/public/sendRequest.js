async function  senderRequest(){
    const elemento = document.getElementById("search-input").value;
    let response = await axios("http://localhost:3000/recursos/emails/" + elemento);

    const res = document.getElementById('res');

    res.innerHTML = JSON.stringify(response.data);
}

