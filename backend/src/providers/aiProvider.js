import fetch from "node-fetch";

function montarFoco(musculo) {
    switch (musculo) {
        case "biceps":
            return "Costas e Bíceps (ênfase em bíceps)";
        case "triceps":
            return "Peito e Tríceps (ênfase em tríceps)";
        case "pernas":
            return "Pernas completas (ênfase total)";
        case "ombros":
            return "Ombros e complementares";
        case "costas":
            return "Costas com auxílio de bíceps";
        case "peito":
            return "Peito com auxílio de tríceps";
        case "abdomen":
            return "Core (abdômen) com foco em estabilidade e definição";
        default:
            return musculo;
    }
}

function definirOrdemTreino(musculo) {
    switch (musculo) {
        case "peito":
        case "triceps":
        case "abdomen":
            return ["Push", "Pull", "Legs"];
        case "costas":
        case "biceps":
            return ["Pull", "Push", "Legs"];
        case "pernas":
            return ["Legs", "Push", "Pull"];
        default:
            return ["Push", "Pull", "Legs"];
    }
}

export default {
    async gerarTreino(musculo, nivel, objetivo) {
        try {
            const ordem = definirOrdemTreino(musculo);
            const foco = montarFoco(musculo);

            const prompt = `Gere um treino de academia dividido em A, B e C.

Nível: ${nivel}
Objetivo: ${objetivo}

O foco principal é: ${foco}

- Treino A: ${ordem[0]} (principal)
- Treino B: ${ordem[1]}
- Treino C: ${ordem[2]}

Regras:
Se o foco for diferente de "abdômen" {
- Treino A: 7 a 8 exercícios
- Treino B: 6 a 7 exercícios
- Treino C: 4 a 5 exercícios
}
Se o foco for igual a "abdômen" {
- Treino A: 7 a 8 exercícios (+1 se o foco for abdômen)
- Treino B: 4 a 5 exercícios (+1 se o foco for abdômen)
- Treino C: 4 a 5 exercícios (+2 se o foco for abdômen)
}

- Para cada músculo, escolha exercícios que atinjam diferentes porções (ex: cabeça longa, lateral, medial)
- Varie os ângulos e tipos de execução (barra, halter, máquina)
- Evite exercícios redundantes (muito parecidos)
- Combine exercícios compostos e isoladores
  
- Use apenas HTML válido
- NÃO use texto puro
- TODOS os nomes de músculos devem estar dentro de <strong>
- TODOS os exercícios devem terminar com <br>
- NÃO escreva nada fora de HTML
- NÃO use markdown
- Cada grupo muscular deve começar com <strong>Nome do músculo</strong><br>
- Os exercícios devem vir logo abaixo

IMPORTANTE:
- Separe os exercícios por músculo dentro de cada treino
- Use o nome do músculo como título

Exemplo de estrutura:

<h3>Treino A (${ordem[0]})</h3>

<strong>Peito</strong><br>
Supino Reto - 4x8<br>
Supino Inclinado - 3x10<br>

<strong>Tríceps</strong><br>
Tríceps Testa - 3x10<br>

<strong>Ombro</strong><br>
Desenvolvimento - 3x10<br>

<h3>Treino B (${ordem[1]})</h3>

<strong>Costas</strong><br>
...

<h3>Treino C (${ordem[2]})</h3>

<strong>Pernas</strong><br>
...

Gere o treino completo seguindo exatamente esse formato.`;

            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${process.env.API_KEY}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{ text: prompt }]
                        }]
                    })
                }
            );

           const data = await response.json();

        if (!data.candidates) {
            console.log("Resposta da IA:", data);
            return "<p>Limite da IA atingido, tente novamente em alguns segundos</p>";
            }

            return data.candidates[0].content.parts[0].text;

        } catch (error) {
            console.error("ERRO COMPLETO:", error);
            return "<p>Erro ao gerar treino</p>";
        }
    }
};