async function register() {
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    const btn = document.getElementById("btnRegister");
    const spinner = document.getElementById("spinner");
    const msg = document.getElementById("msg");

    msg.innerText = "";

    // 🔥 loading
    btn.disabled = true;
    spinner.style.display = "inline-block";

    try {
        if (!nome || !email || !senha) {
            msg.innerText = "Preencha todos os campos";
            return;
        }
        const res = await fetch("https://treino-academia-ia.onrender.com/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome,
                email,
                senha
            })
        });

        const texto = await res.text();

        if (!res.ok) throw new Error(texto);

        msg.style.color = "#00ff88";
        msg.innerText = "Conta criada com sucesso!";

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1500);

    } catch (error) {
        msg.style.color = "red";
        msg.innerText = error.message;
    }

    btn.disabled = false;
    spinner.style.display = "none";
}