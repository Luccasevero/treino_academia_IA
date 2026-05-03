async function validarToken() {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {
        const res = await fetch("http://localhost:3000/validar-token", {
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