async function login() {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    const btn = document.getElementById("btnLogin");
    const spinner = document.getElementById("spinner");
    const msgErro = document.getElementById("msgErro");

    msgErro.innerText = "";

    // loading
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

        if (!res.ok) {
            const erro = await res.text();
            throw new Error(erro);
        }

        const data = await res.json();

        // 💾 salva token
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", email);
        // 🔥 redireciona
        window.location.href = "index.html";

    } catch (error) {
        msgErro.innerText = error.message;
    }

    // volta botão
    btn.disabled = false;
    spinner.style.display = "none";
}