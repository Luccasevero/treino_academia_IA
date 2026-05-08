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

let avatarBase64 = "";
let avatarAtual = "";
//carrega
async function carregarPerfil() {
    const res = await fetch("https://treino-academia-ia.onrender.com/perfil", {
        headers: {
            Authorization: "Bearer " + token
        }
    });

    const data = await res.json();

    document.getElementById("nome").value = data.nome || "";
    document.getElementById("email").value = data.email;

    avatarAtual = data.avatar || "";

    if (data.avatar) {
        document.getElementById("avatar").src = data.avatar;
    } else {
        document.getElementById("avatar").src = "default.png";
    }
}

carregarPerfil();


//altera foto
document.getElementById("inputFoto").addEventListener("change", function(e) {
    const file = e.target.files[0];

    const reader = new FileReader();

    reader.onload = function() {
        avatarBase64 = reader.result;
        document.getElementById("avatar").src = avatarBase64;
    };

    reader.readAsDataURL(file);
});

//salva alterações
async function salvarPerfil() {
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;

    const avatarFinal = avatarBase64 || avatarAtual;

    if (!email) {
    alert("Email obrigatório");
    return;
    }

    await fetch("https://treino-academia-ia.onrender.com/perfil", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
        },
        body: JSON.stringify({
            nome,
            email,
            avatar: avatarFinal
        })
    });

    const res = await fetch('...');
    const data = await res.text();
    console.log("RESPOSTA BACKEND:", data);

    alert("Perfil atualizado!");
}

//troca senha
async function trocarSenha() {
    const senha = document.getElementById("novaSenha").value;

    await fetch("https://treino-academia-ia.onrender.com/login", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
        },
        body: JSON.stringify({ senha })
    });

    alert("Senha atualizada!");
}

async function carregarAvatarMenu() {
    const res = await fetch("https://treino-academia-ia.onrender.com/login", {
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