alert("Olá Vander😜");

// 1. Seleção dos Elementos do DOM
const inputNome = document.getElementById('nome');
const inputQuantidade = document.getElementById('quantidade');
const inputPreco = document.getElementById('preco'); // NOVO
const inputCep = document.getElementById('cep');
const inputRua = document.getElementById('rua');
const inputNumero = document.getElementById('numero'); // NOVO
const inputComplemento = document.getElementById('complemento'); // NOVO
const inputBairro = document.getElementById('bairro');
const inputCidade = document.getElementById('cidade');
const inputEstado = document.getElementById('estado');
const form = document.getElementById('form-cadastro');

// 2. Função para buscar o CEP via Fetch API (AJAX)
async function buscarCep() {
    const cepValor = inputCep.value.replace(/\D/g, '');

    if (cepValor.length !== 8) {
        document.getElementById('erro-cep').innerText = 'Informe um CEP válido com 8 dígitos.';
        limparEndereco();
        return;
    }

    document.getElementById('erro-cep').innerText = '';

    try {
        const resposta = await fetch(`https://viacep.com.br/ws/${cepValor}/json/`);
        const dados = await resposta.json();

        if (dados.erro) {
            document.getElementById('erro-cep').innerText = 'CEP não encontrado.';
            limparEndereco();
        } else {
            // Preenche os dados automáticos
            inputRua.value = dados.logradouro;
            inputBairro.value = dados.bairro;
            inputCidade.value = dados.localidade;
            inputEstado.value = dados.uf;

            // Dica de UX: Joga o cursor do teclado direto para o campo Número!
            inputNumero.focus();
        }
    } catch (erro) {
        document.getElementById('erro-cep').innerText = 'Erro ao buscar o CEP.';
    }
}

function limparEndereco() {
    inputRua.value = '';
    inputNumero.value = '';
    inputComplemento.value = '';
    inputBairro.value = '';
    inputCidade.value = '';
    inputEstado.value = '';
}

// Evento disparado ao sair do campo CEP
inputCep.addEventListener('blur', buscarCep);

// 3. Validação do Formulário e Inserção Dinâmica
form.addEventListener('submit', function (evento) {
    evento.preventDefault();

    let valido = true;

    const nome = inputNome.value.trim();
    const quantidade = inputQuantidade.value.trim();
    const preco = inputPreco.value.trim(); // NOVO
    const numero = inputNumero.value.trim(); // NOVO

    // Validação do Nome
    if (nome === '') {
        document.getElementById('erro-nome').innerText = 'O nome do item é obrigatório.';
        valido = false;
    } else {
        document.getElementById('erro-nome').innerText = '';
    }

    // Validação da Quantidade
    if (quantidade === '' || parseInt(quantidade) <= 0) {
        document.getElementById('erro-quantidade').innerText = 'Informe uma quantidade válida.';
        valido = false;
    } else {
        document.getElementById('erro-quantidade').innerText = '';
    }

    // Validação do Preço Unitário (NOVO)
    if (preco === '' || parseFloat(preco) <= 0) {
        document.getElementById('erro-preco').innerText = 'Informe um preço válido.';
        valido = false;
    } else {
        document.getElementById('erro-preco').innerText = '';
    }

    // Validação do Número da Residência (NOVO)
    if (numero === '') {
        document.getElementById('erro-numero').innerText = 'O número é obrigatório.';
        valido = false;
    } else {
        document.getElementById('erro-numero').innerText = '';
    }

    // Nota: O campo Complemento é opcional, por isso não tem bloco "if" de erro.

    // Se tudo estiver correto, adiciona o item na tabela
    if (valido) {
        const tabelaCorpo = document.querySelector('tbody');
        const precoFormatado = parseFloat(preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        const novaLinha = `
            <tr>
                <td>${nome}</td>
                <td>${quantidade}</td>
                <td>${precoFormatado}</td>
                <td>${inputCidade.value || 'N/A'}</td>
            </tr>
        `;

        tabelaCorpo.insertAdjacentHTML('beforeend', novaLinha);

        alert('Cadastro realizado com sucesso!');

        form.reset();
        limparEndereco();
    }
});