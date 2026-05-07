import dotenv from "dotenv";
dotenv.config();

import pool from "./database/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import express from "express";
import cors from "cors";
import aiProvider from "./providers/aiProvider.js";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

//perfil
app.get("/perfil", autenticar, async (req, res) => {
    const result = await pool.query(
        "SELECT id, email, nome, avatar FROM usuarios WHERE id = $1",
        [req.userId]
    );

    res.json(result.rows[0]);
});

//atualizar perfil
app.put("/perfil", autenticar, async (req, res) => {
    try {
        let { nome, email, avatar } = req.body;

        if (!email || !nome) {
            return res.status(400).send("Nome e email são obrigatórios");
        }

        const result = await pool.query(
            "SELECT * FROM usuarios WHERE id = $1",
            [req.userId]
        );

        const usuario = result.rows[0];

        nome = nome || usuario.nome;
        email = email || usuario.email;
        avatar = avatar || usuario.avatar;

        await pool.query(
            "UPDATE usuarios SET nome=$1, email=$2, avatar=$3 WHERE id=$4",
            [nome, email, avatar, req.userId]
        );

        res.send("Perfil atualizado");

    } catch (error) {
        console.error(error);
        res.status(500).send("Erro no servidor");
    }
});

//trocar senha 
app.put("/senha", autenticar, async (req, res) => {
    const { senha } = req.body;

    const senhaHash = await bcrypt.hash(senha, 10);

    await pool.query(
        "UPDATE usuarios SET senha=$1 WHERE id=$2",
        [senhaHash, req.userId]
    );

    res.send("Senha atualizada");
});

app.get("/treino", async (req, res) => {
    try {
        const { musculo, nivel, objetivo } = req.query;

        const treino = await aiProvider.gerarTreino(musculo, nivel, objetivo);

        res.send(treino);

    } catch (error) {
        console.error("ERRO:", error);
        res.status(500).send("Erro ao gerar treino");
    }
});

//
// 🔥 CADASTRO
//
app.post("/register", async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        // 🔥 validação
        if (!nome || !email || !senha) {
            return res.status(400).send("Preencha todos os campos");
        }

        // 🔥 verifica se já existe
        const existe = await pool.query(
            "SELECT * FROM usuarios WHERE email = $1",
            [email]
        );

        if (existe.rows.length > 0) {
            return res.status(400).send("Email já cadastrado");
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        // 🔥 agora salva com nome
        await pool.query(
            "INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3)",
            [nome, email, senhaHash]
        );

        res.send("Usuário criado!");

    } catch (error) {
        console.error("ERRO REGISTER:", error);
        res.status(500).send("Erro ao cadastrar");
    }
});

//
// 🔥 LOGIN
//
app.post("/login", async (req, res) => {
    const { email, senha } = req.body;

    try {
        const result = await pool.query(
            "SELECT * FROM usuarios WHERE email = $1",
            [email]
        );

        const user = result.rows[0];

        if (!user) return res.status(400).send("Usuário não encontrado");

        const senhaValida = await bcrypt.compare(senha, user.senha);

        if (!senhaValida) return res.status(400).send("Senha incorreta");

        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({ token });

    } catch (error) {
        console.error(error);
        res.status(500).send("Erro no login");
    }
});

//
// 🔐 MIDDLEWARE DE AUTENTICAÇÃO
//
function autenticar(req, res, next) {
    const auth = req.headers.authorization;

    if (!auth) return res.status(401).send("Sem token");

    const token = auth.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch {
        res.status(401).send("Token inválido");
    }
}

//
// 💾 SALVAR TREINO
//
app.post("/salvar-treino", autenticar, async (req, res) => {
    try {
        const { musculo, nivel, objetivo, conteudo } = req.body;

        await pool.query(
            "INSERT INTO treinos (musculo, nivel, objetivo, conteudo, usuario_id) VALUES ($1,$2,$3,$4,$5)",
            [musculo, nivel, objetivo, conteudo, req.userId]
        );

        res.send("Treino salvo com sucesso!");

    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao salvar treino");
    }
});

//
// 📚 LISTAR TREINOS DO USUÁRIO
//
app.get("/meus-treinos", autenticar, async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM treinos WHERE usuario_id = $1 ORDER BY id DESC",
            [req.userId]
        );

        res.json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao buscar treinos");
    }
});

app.delete("/treinos/:id", autenticar, async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query(
            "DELETE FROM treinos WHERE id = $1 AND usuario_id = $2",
            [id, req.userId]
        );

        res.send("Treino excluído");
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao excluir");
    }
});

//
// 🚀 START SERVER
//
app.listen(PORT, '0.0.0.0', () => {
    console.log("Servidor rodando na porta " + PORT);
});

app.get("/validar-token", autenticar, async (req, res) => {
    res.send({ ok: true });
});