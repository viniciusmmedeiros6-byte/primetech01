
const btnEnviar = document.getElementById("btnEnviar");
const apiKeyInput = document.getElementById("apiKey");
const mensagemInput = document.getElementById("mensagem");
const respostaDiv = document.getElementById("resposta");

btnEnviar.addEventListener("click", enviarMensagem);

async function enviarMensagem() {
    const apiKey = apiKeyInput.value.trim();
    const mensagem = mensagemInput.value.trim();

    if (!apiKey) {
        respostaDiv.textContent = "Digite sua chave da API.";
        return;
    }

    if (!mensagem) {
        respostaDiv.textContent = "Digite uma mensagem para continuar.";
        return;
    }

    btnEnviar.disabled = true;
    btnEnviar.textContent = "Enviando...";
    respostaDiv.textContent = "A Prime Tech está preparando sua resposta...";

    try {
        const response = await fetch(
            "https://api.openai.com/v1/responses",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-5.4-nano",

                    instructions: `
Você é o assistente virtual oficial da empresa Prime Tech.

IDENTIDADE DA EMPRESA:
Nome: Prime Tech.
Slogan: Tecnologia de primeira.
Tipo: Loja virtual de celulares e acessórios tecnológicos.

SOBRE A EMPRESA:
A Prime Tech é uma loja online especializada
na venda de celulares e acessórios tecnológicos.
Seu objetivo é oferecer praticidade, qualidade,
segurança e bom atendimento aos clientes.

PRODUTOS:
- Celulares.
- Fones de ouvido.
- Carregadores.
- Cabos USB.
- Capas para celulares.

MISSÃO:
Facilitar o acesso à tecnologia oferecendo
produtos de qualidade, praticidade e segurança.

VALORES:
- Qualidade.
- Inovação.
- Honestidade.
- Segurança.
- Compromisso.
- Responsabilidade.

REGRAS DE ATENDIMENTO:
1. Cumprimente os clientes com educação.
2. Responda sempre em português.
3. Seja simpático, claro e profissional.
4. Ajude os clientes com dúvidas sobre celulares
   e acessórios vendidos pela empresa.
5. Não invente preços, promoções ou estoque.
6. Se não souber uma informação, explique
   educadamente que ela precisa ser confirmada.
7. Não forneça informações falsas.
8. Mantenha o foco nos produtos e serviços da Prime Tech.
9. Para assuntos fora do contexto da empresa,
   responda:
   "Sou o assistente virtual da Prime Tech e
   estou aqui para ajudar com nossos produtos
   e serviços tecnológicos."
`,

                    input: mensagem
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error?.message || "Erro ao acessar a API."
            );
        }

        const textos = [];

        for (const item of data.output || []) {
            for (const conteudo of item.content || []) {
                if (conteudo.type === "output_text") {
                    textos.push(conteudo.text);
                }
            }
        }

        respostaDiv.textContent =
            textos.join("\n") || "Não foi possível obter uma resposta.";

    } catch (erro) {
        respostaDiv.textContent =
            "Erro: " + erro.message;
    } finally {
        btnEnviar.disabled = false;
        btnEnviar.textContent = "Enviar mensagem";
    }
}
