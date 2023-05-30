async function senderRequest() {
    try {
        const elemento = document.getElementById("search-input").value;
        let recurso = document.getElementById("recursos").value;
        let response = await axios("http://localhost:3000/recursos/" + recurso + "/" + elemento)
        const res = document.getElementById('res');
        res.innerHTML = JSON.stringify(response.data);
    } catch {
        res.innerHTML = ("No se ha encontrado ninguna ocurrencia")

    }
}

