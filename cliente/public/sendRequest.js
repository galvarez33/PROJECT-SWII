

async function  senderRequest(){
    const elemento = document.getElementById("search-input").value;
    let response = await axios("http://localhost:3000/recursos/emails/" + elemento);
    console.log(response)
}
