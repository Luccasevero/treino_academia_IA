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

async function carregarTreinos() {
    const div = document.getElementById("listaTreinos");

    if (!div) return; // Proteção caso a div não exista na página

    div.innerHTML = "Carregando...";

    try {
        const token = localStorage.getItem("token"); 

        const res = await fetch("https://treino-academia-ia.onrender.com/meus-treinos", {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if (!res.ok) {
            throw new Error("Erro na resposta do servidor: Status " + res.status);
        }

        const treinos = await res.json();

        if (treinos.length === 0) {
            div.innerHTML = "<p>Você ainda não salvou treinos.</p>";
            return;
        }

        div.innerHTML = "";

        treinos.forEach(t => {
            const textoTreino = t.conteudo ? t.conteudo.replace(/\n/g, "<br>") : "";

            div.innerHTML += `
                <div class="treino">
                    <h3>${t.musculo} - ${t.objetivo}</h3>
                    <p>${textoTreino}</p>
                    <button class="btnExcluir" onclick="excluirTreino(${t.id})">
                        🗑 Excluir
                    </button>
                </div>
            `;
        });

    } catch (error) {
        div.innerHTML = "<p>Erro ao carregar treinos</p>";
        console.error("Erro no carregarTreinos:", error);
    }
}

async function excluirTreino(id) {
    if (!confirm("Deseja excluir este treino?")) return;

    try {
        await fetch(`https://treino-academia-ia.onrender.com/treinos/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        carregarTreinos();

    } catch (error) {
        console.error(error);
    }
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

// 🔥 carrega ao abrir a página
carregarTreinos();

async function carregarAvatarMenu() {
    const res = await fetch("https://treino-academia-ia.onrender.com/perfil", {
        headers: {
            Authorization: "Bearer " + token
        }
    });

    const data = await res.json();


    const avatarEl = document.getElementById("avatarMenu");

    if (avatarEl) { // 🔥 evita erro se não existir na página
        if (data.avatar) {
            avatarEl.src = data.avatar;
        } else {
            avatarEl.src = "default.png";
        }
    }
}
carregarAvatarMenu();