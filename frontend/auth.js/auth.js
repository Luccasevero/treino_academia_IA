async function validarToken() {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {
        // MUDADO: Agora aponta para o seu servidor do Render
        const res = await fetch("https://treino-academia-ia.onrender.com/validar-token", {
            headers: {
                Authorization: "Bearer " + token
            }
        });

        if (!res.ok) throw new Error();

    } catch {
        localStorage.clear();
        window.location.href = "login.html";
    }
}

// Executa a função assim que o arquivo é carregado na página
validarToken();