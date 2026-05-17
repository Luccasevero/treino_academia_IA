const email = localStorage.getItem("email");

const userEmailEl = document.getElementById("userEmail");

if (email && userEmailEl) {
    userEmailEl.innerText = "👤 " + email;
}

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

function toggleMenu() {
    const menu = document.getElementById("menu");

    if (menu.style.left === "0px") {
        menu.style.left = "-250px";
    } else {
        menu.style.left = "0px";
    }
}
document.addEventListener("click", function(event) {
    const menu = document.getElementById("menu");
    const btn = document.querySelector(".menu-btn");

    if (!menu.contains(event.target) && !btn.contains(event.target)) {
        menu.style.left = "-250px";
    }
});

function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

const btn = document.getElementById("btnGerar");

let treinoGerado = ""; // 🔥 variável global

async function gerarTreino() {
    const musculo = document.getElementById("musculo").value;
    const nivel = document.getElementById("nivel").value;
    const objetivo = document.getElementById("objetivo").value;

    const divResultado = document.getElementById("resultado");

    // 🔥 botão carregando
    btn.innerHTML = `<span class="spinner"></span>Gerando...`;
    btn.disabled = true;

    

    try {
        const res = await fetch(`https://treino-academia-ia.onrender.com/treino?musculo=${musculo}&nivel=${nivel}&objetivo=${objetivo}`);
        let html = await res.text();

        // 🔥 salva o treino
        treinoGerado = html;

        divResultado.innerHTML = `
            <div class="treino-card">
                ${html}
            </div>
        `;

        // 🔥 mostra botão salvar
        document.getElementById("btnSalvar").style.display = "block";

    } catch (error) {
        divResultado.innerHTML = `
            <div class="treino-card">
                <p>Erro ao conectar com o servidor.</p>
            </div>
        `;
        console.error(error);
    }

    // 🔥 volta botão ao normal
    btn.innerText = "Gerar Treino";
    btn.disabled = false;
}

// 🔥 FORA da função (IMPORTANTE)
async function salvarTreino() {
    const musculo = document.getElementById("musculo").value;
    const nivel = document.getElementById("nivel").value;
    const objetivo = document.getElementById("objetivo").value;

    try {
        const res = await fetch("https://treino-academia-ia.onrender.com/salvar-treino", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token") // 🔥 AQUI
            },
            body: JSON.stringify({
                musculo,
                nivel,
                objetivo,
                conteudo: treinoGerado
            })
        });

        if (!res.ok) {
            throw new Error("Erro ao salvar treino");
        }

        // mensagem na tela
        const msgEl = document.getElementById("msgSucesso");
        msgEl.innerText = "✅ Treino salvo com sucesso!";
        msgEl.style.display = "block";

        document.getElementById("btnSalvar").style.display = "none";

    } catch (error) {
        console.error(error);
    }
}

async function carregarAvatarMenu() {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const response = await fetch("https://treino-academia-ia.onrender.com/perfil", {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (response.ok) {
        const dados = await response.json(); 
        
        const avatarEl = document.getElementById("avatarMenu");

        if (avatarEl) { 
            if (dados && dados.avatar) {
                avatarEl.src = dados.avatar;
            } else {
                avatarEl.src = "default.png";
            }
        }

    } else {
        // Se o token expirou ou é inválido, limpa e desloga
        localStorage.removeItem("token");
        window.location.href = "login.html";
    }
}

carregarAvatarMenu();