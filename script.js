// ================== URLs DAS APIs ==================
// Endpoints do backend (CRUD)
const API_EQUIPES = "http://localhost:8080/equipes";
const API_FILMES = "http://localhost:8080/filmes";
const API_CARGOS = "http://localhost:8080/cargos";
const API_REL = "http://localhost:8080/filmesequipe";

// ================== INIT ==================
// Função inicial chamada ao carregar a página
async function init() {
  await carregarTudo(); // Carrega todos os dados iniciais
}

// Carrega tudo de uma vez (equipes, filmes e relações)
async function carregarTudo() {
  await carregarEquipes();
  await carregarFilmes();
  await carregarRelacoes();
}

// ================== EQUIPE ==================
// Busca equipes na API e atualiza HTML
async function carregarEquipes() {
  const res = await fetch(API_EQUIPES); // Faz requisição GET
  const data = await res.json(); // Converte resposta para JSON

  // Pegando elementos do HTML
  const lista = document.getElementById("listaEquipes");
  const select = document.getElementById("selectEquipe");
  const selectRel = document.getElementById("selectEquipeRel");

  // Limpando conteúdo antes de atualizar
  lista.innerHTML = "";
  select.innerHTML = "";
  selectRel.innerHTML = "";

  // Percorre cada equipe retornada da API
  data.forEach(e => {
    // Mostra equipe na tela
    lista.innerHTML += `
      <div class="item">
        ${e.nome}
        <button onclick="deletarEquipe(${e.id})">🗑️</button>
      </div>
    `;

    // Preenche selects (dropdowns)
    select.innerHTML += `<option value="${e.id}">${e.nome}</option>`;
    selectRel.innerHTML += `<option value="${e.id}">${e.nome}</option>`;
  });
}

// Salva uma nova equipe (CREATE)
async function salvarEquipe() {
  // Monta objeto com dados do formulário
  const equipe = {
    nome: nomeEquipe.value,
    anoNascimento: anoEquipe.value,
    nacionalidade: nacionalidadeEquipe.value
  };

  // Envia para API
  await fetch(API_EQUIPES, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(equipe)
  });

  carregarEquipes(); // Atualiza lista após salvar
}

// Deleta equipe pelo ID (DELETE)
async function deletarEquipe(id) {
  await fetch(`${API_EQUIPES}/${id}`, { method: "DELETE" });
  carregarEquipes(); // Atualiza lista após deletar
}

// ================== FILMES ==================
// Busca filmes e atualiza tela
async function carregarFilmes() {
  const res = await fetch(API_FILMES);
  const data = await res.json();

  const lista = document.getElementById("listaFilmes");
  const select = document.getElementById("selectFilmeRel");

  lista.innerHTML = "";
  select.innerHTML = "";

  data.forEach(f => {
    // Exibe filme na tela
    lista.innerHTML += `
      <div class="item">
        ${f.nomeFilme}
        <button onclick="deletarFilme(${f.id})">🗑️</button>
      </div>
    `;

    // Preenche select para relacionamento
    select.innerHTML += `<option value="${f.id}">${f.nomeFilme}</option>`;
  });
}

// Salva novo filme (CREATE)
async function salvarFilme() {
  const filme = {
    nomeFilme: nomeFilme.value,
    anoLancamento: anoFilme.value,
    categoria: categoriaFilme.value
  };

  await fetch(API_FILMES, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(filme)
  });

  carregarFilmes(); // Atualiza lista
}

// Deleta filme (DELETE)
async function deletarFilme(id) {
  await fetch(`${API_FILMES}/${id}`, { method: "DELETE" });
  carregarFilmes();
}

// ================== CARGO ==================
// Cria um cargo vinculado a uma equipe
async function salvarCargo() {
  const cargo = {
    cargo: nomeCargo.value, // Nome do cargo
    idEquipe: selectEquipe.value // Relaciona com equipe
  };

  await fetch(API_CARGOS, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(cargo)
  });

  alert("Cargo adicionado!"); // Feedback simples ao usuário
}

// ================== RELAÇÃO ==================
// Relaciona equipe com filme (tabela intermediária)
async function relacionar() {
  const body = {
    idEquipe: selectEquipeRel.value,
    idFilme: selectFilmeRel.value
  };

  await fetch(API_REL, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(body)
  });

  carregarRelacoes(); // Atualiza lista de relações
}

// Busca e exibe relações (JOIN entre equipe e filme)
async function carregarRelacoes() {
  const res = await fetch(API_REL);
  const data = await res.json();

  const lista = document.getElementById("listaRelacoes");
  lista.innerHTML = "";

  data.forEach(r => {
    // Usa optional chaining (?.) para evitar erro se vier null
    lista.innerHTML += `
      <div class="item">
        👤 ${r.equipe?.nome} → 🎬 ${r.filme?.nomeFilme}
      </div>
    `;
  });
}

// ================== START ==================
// Inicia o sistema ao carregar
init();