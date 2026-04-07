const API_EQUIPES = "http://localhost:8080/equipes";
const API_FILMES = "http://localhost:8080/filmes";
const API_CARGOS = "http://localhost:8080/cargos";
const API_REL = "http://localhost:8080/filmesequipe";

let editandoId = null;
let equipes = [];
let filmes = [];
let cargos = [];
let filmesEquipe = [];

// INIT
async function init() {
  await carregarDados();
}

async function carregarDados() {
  await carregarEquipes();
  await carregarFilmes();
  await carregarCargos();
  await carregarRelacoes();
}

// ================== EQUIPE ==================
async function carregarEquipes() {
  const res = await fetch(API_EQUIPES);
  const data = await res.json();
  equipes = data;

  const lista = document.getElementById("listaEquipes");
  const select = document.getElementById("selectEquipe");
  const selectRel = document.getElementById("selectEquipeRel");

  lista.innerHTML = "";
  select.innerHTML = "";
  selectRel.innerHTML = "";

  data.forEach(e => {
    lista.innerHTML += `
      <div class="item">
        ${e.nome}
        <button onclick="editarEquipe(${e.id})">✏️</button>
        <button onclick="deletar('${API_EQUIPES}/${e.id}')">🗑️</button>
      </div>
    `;

    select.innerHTML += `<option value="${e.id}">${e.nome}</option>`;
    selectRel.innerHTML += `<option value="${e.id}">${e.nome}</option>`;
  });
}

async function salvarEquipe() {
  const nome = document.getElementById("nomeEquipe").value;
  const ano = document.getElementById("anoEquipe").value;
  const nacionalidade = document.getElementById("nacionalidadeEquipe").value;

  const metodo = editandoId ? "PUT" : "POST";
  const url = editandoId ? `${API_EQUIPES}/${editandoId}` : API_EQUIPES;

  await fetch(url, {
    method: metodo,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nome,
      anoNascimento: Number(ano),
      nacionalidade
    })
  });

  editandoId = null;
  carregarDados();
}

function editarEquipe(id) {
  const e = equipes.find(e => e.id === id);

  document.getElementById("nomeEquipe").value = e.nome;
  document.getElementById("anoEquipe").value = e.anoNascimento;
  document.getElementById("nacionalidadeEquipe").value = e.nacionalidade;

  editandoId = id;
}

// ================== FILMES ==================
async function carregarFilmes() {
  const res = await fetch(API_FILMES);
  const data = await res.json();
  filmes = data;

  const lista = document.getElementById("listaFilmes");
  const select = document.getElementById("selectFilmeRel");

  lista.innerHTML = "";
  select.innerHTML = "";

  data.forEach(f => {
    lista.innerHTML += `
      <div class="item">
        ${f.nomeFilme}
        <button onclick="editarFilme(${f.id})">✏️</button>
        <button onclick="deletar('${API_FILMES}/${f.id}')">🗑️</button>
      </div>
    `;

    select.innerHTML += `<option value="${f.id}">${f.nomeFilme}</option>`;
  });
}

async function salvarFilme() {
  const nomeFilme = document.getElementById("nomeFilme").value;
  const ano = document.getElementById("anoFilme").value;
  const categoria = document.getElementById("categoriaFilme").value;

  const metodo = editandoId ? "PUT" : "POST";
  const url = editandoId ? `${API_FILMES}/${editandoId}` : API_FILMES;

  await fetch(url, {
    method: metodo,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nomeFilme,
      anoLancamento: Number(ano),
      categoria
    })
  });

  editandoId = null;
  carregarDados();
}

function editarFilme(id) {
  const f = filmes.find(f => f.id === id);

  document.getElementById("nomeFilme").value = f.nomeFilme;
  document.getElementById("anoFilme").value = f.anoLancamento;
  document.getElementById("categoriaFilme").value = f.categoria;

  editandoId = id;
}

// ================== CARGO ==================
async function carregarCargos() {
  const res = await fetch(API_CARGOS);
  const data = await res.json();
  cargos = data;

  const lista = document.getElementById("listaCargos");
  lista.innerHTML = "";

  data.forEach(c => {
    lista.innerHTML += `
      <div class="item">
        🎭 ${c.cargo} → 👤 ${c.equipe?.nome || "Sem equipe"}
      </div>
    `;
  });
}

async function salvarCargo() {
  const nomeCargo = document.getElementById("nomeCargo").value;
  const idEquipe = document.getElementById("selectEquipe").value;

  await fetch(API_CARGOS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      cargo: nomeCargo,
      idEquipe: Number(idEquipe)
    })
  });

  carregarDados();
}

// ================== RELAÇÃO ==================
async function carregarRelacoes() {
  const res = await fetch(API_REL);
  const data = await res.json();
  filmesEquipe = data;

  const lista = document.getElementById("listaRelacoes");
  lista.innerHTML = "";

  data.forEach(r => {
    lista.innerHTML += `
      <div class="item">
        👤 ${r.equipe?.nome} → 🎬 ${r.filme?.nomeFilme}
        <button onclick="deletar('${API_REL}/${r.id}')">🗑️</button>
      </div>
    `;
  });
}

async function salvarRelacao() {
  const idEquipe = document.getElementById("selectEquipeRel").value;
  const idFilme = document.getElementById("selectFilmeRel").value;

  await fetch(API_REL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      idEquipe: Number(idEquipe),
      idFilme: Number(idFilme)
    })
  });

  carregarDados();
}

// ================== DELETE GLOBAL ==================
async function deletar(url) {
  await fetch(url, { method: "DELETE" });
  carregarDados();
}

// START
init();