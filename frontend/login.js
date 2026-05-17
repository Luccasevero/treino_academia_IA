async function login() {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    const btn = document.getElementById("btnLogin");
    const spinner = document.getElementById("spinner");
    const msgErro = document.getElementById("msgErro");

    msgErro.innerText = "";

    // Ativa o loading
    btn.disabled = true;
    spinner.style.display = "inline-block";

    try {
        const res = await fetch("https://treino-academia-ia.onrender.com/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, senha })
        });

        // Lê a resposta primeiro como texto puro para evitar quebra de JSON vazio
        const text = await res.text();

        // Se o servidor respondeu com sucesso (200), mas o corpo veio totalmente vazio (CORS bloqueando)
        if (res.ok && !text) {
            throw new Error("O servidor respondeu com o corpo vazio. Verifique os logs de CORS no backend.");
        }

        // Se o servidor respondeu com algum erro (Ex: 400 Usuário não encontrado, 500 Erro interno)
        if (!res.ok) {
            throw new Error(text || "Erro desconhecido no servidor.");
        }

        // Se chegou aqui e tem texto, transforma em objeto JSON com segurança
        const data = JSON.parse(text);

        // 💾 Salva os dados no navegador
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", email);
        
        // 🔥 Redireciona para a tela principal
        window.location.href = "index.html";

    } catch (error) {
        console.error("Erro completo ao salvar:", error);
        alert("Falha ao salvar: " + error.message);
    }

    // Desativa o loading e devolve o botão ao estado normal
    btn.disabled = false;
    spinner.style.display = "none";
}