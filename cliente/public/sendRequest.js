async function senderRequest() {
    try {
        document.getElementById("res").style.color = "#28ad52"
        const elemento = document.getElementById("search-input").value;
        let recurso = document.getElementById("recursos").value;
        if (recurso == "default"){
            alert("Selccione un recurso")
            return
        }
        let response = await axios("http://localhost:3000/recursos/" + recurso + "/" + elemento)
        const res = document.getElementById('res');

        if (response.data) {
            document.getElementById("res").style.color = "#a82c2c";
            res.innerHTML = JSON.stringify(response.data);
        }
    } catch {
        res.innerHTML = ("ENHORABUENA, No se ha encontrado ninguna ocurrencia.")
    };
}

