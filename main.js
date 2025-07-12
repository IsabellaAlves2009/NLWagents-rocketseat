const apiKeyInput = document.getElementById('apiKey')
const questionInput = document.getElementById('question-input')
const askButton = document.getElementById('ask-button') 
const form = document.getElementById('form')
const aiResponse = document.getElementById('ai-response')
const gameSelect = document.getElementById('game-select')

const perguntarIA = async (question, game, apiKey) => {
        const model = 'gemini-2.5-flash'
        const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
        const perguntaLOL = `
            ## Especialidade
            Você é um especialista de meta para o jogo ${game}

            ## Tarefa
            Você deve responder as perguntas do usuário com base
            no seu conhecimento sobre o jogo ${game}

            ## Regras
            - Se você não sabe a resposta, responda "não sei" e não
            tente inventar uma resposta.
            - Se a pergunta não está relacionada ao jogo,
            responda com 'Essa pergunta não está relacionada ao jogo'
            - Considere a data atual ${new Date().toLocaleDateString()}
            - Faça pesquisas atualizadas sobre o path atual, baseado na
            data atual, para dar uma resposta coerente.
            - Nunca responda itens que você não tem certeza de que existe no
            patch atual.

            ## Resposta
            - Economize na resposta, seja direto e responda no máximo 500 caracteres.
            - Responda em markdown.
            - Não precisa fazer nenhuma saudação ou despedida, apenas responda o que o usuário está
            pedindo.

            ## Exemplo de resposta
            - pergunta do usuário: Melhor build rengar jungle
            - resposta: a build mais atual é \n\n **Itens:** \n\n
            coloque oss itens aqui.\n\n**Runas:** \n\n **exemplo de runas:**\n\n

            ----------
            Aqui está a pergunta do usuário: ${question}

        `
    

        const contents = [{
            role: 'user',
            parts: [{
                text: pergunta
            }]
        }]
        const response = await fetch(geminiURL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              contents
            })
        });

        

        const data = await response.json()
        console.log({data})
        return
}

const enviarFormulario = async (event) => {
    event.preventDefault()
    const apiKey = apiKeyInput.value
    const game =  gameSelect.value
    const question = questionInput.value
    
    if (apiKey == '' || game == '' || question == '') {
        alert('por favor, preencha todos os campos.')
        return
    }
    askButton.disabled = true
    askButton.textContent = 'Perguntando...'
    askButton.classList.add('loading')

    try{
        const text = await perguntarAI(question, game, apiKey)
        aiResponse.querySelector('.response-content').innerHTML = markdowmToHTML(text)
        aiResponse.classList.remove('hidden')
    }catch(error){
        alert('Erro:', error)
    } finally{
        askButton.disabled = false
        askButton.textContent = 'Perguntar'
        askButton.classList.remove('loading')
    }
}

form.addEventListener('submit', enviarFormulario)