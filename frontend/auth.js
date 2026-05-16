async function validarToken() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }
    try {
        const res = await fetch("https://treino-academia-ia-1.onrender.com/validar-token", {
            headers: { Authorization: "Bearer " + token }
        });
        if (!res.ok) throw new Error();
    } catch {
        localStorage.clear();
        window.location.href = "login.html";
    }
}
validarToken();