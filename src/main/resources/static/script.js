const API_URL = 'http://localhost:8080/materia';
let todasAsMaterias = [];
let callbackConfirmacaoModal = null;

// Padrão default: ID ascendente
let colunaAtual = 'id';
let ordemAscendente = true;

document.addEventListener('DOMContentLoaded', carregarMaterias);

// Notificações na tela (Toast)
function mostrarAviso(mensagem, tipo = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${tipo}`;
    toast.innerText = mensagem;
    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3500);
}

// -------------------------------------------------------------
// MODAL CUSTOMIZADO UNIVERSAL (Alertas, Erros e Confirmação)
// -------------------------------------------------------------
function abrirModal({ titulo, mensagem, tipo = 'erro', acaoConfirmar = null }) {
    const modal = document.getElementById('custom-modal');
    const box = document.getElementById('modal-box');
    const titleEl = document.getElementById('modal-title');
    const msgEl = document.getElementById('modal-message');
    const btnContainer = document.getElementById('modal-buttons');

    if (!modal || !box || !titleEl || !msgEl || !btnContainer) return;

    titleEl.innerText = titulo;
    msgEl.innerText = mensagem;
    btnContainer.innerHTML = '';
    callbackConfirmacaoModal = acaoConfirmar;

    // Personaliza estilos e botões conforme o tipo
    if (tipo === 'erro') {
        box.className = 'modal-content error-theme';
        btnContainer.innerHTML = `<button type="button" class="btn-danger" onclick="fecharModal()">Entendi</button>`;
    } else if (tipo === 'confirm') {
        box.className = 'modal-content confirm-theme';
        btnContainer.innerHTML = `
      <button type="button" class="btn-secondary" onclick="fecharModal()">Cancelar</button>
      <button type="button" class="btn-danger" onclick="confirmarAcaoModal()">Excluir</button>
    `;
    } else {
        box.className = 'modal-content confirm-theme';
        btnContainer.innerHTML = `<button type="button" class="btn-primary" onclick="fecharModal()">OK</button>`;
    }

    modal.style.display = 'flex';
}

function fecharModal() {
    const modal = document.getElementById('custom-modal');
    if (modal) modal.style.display = 'none';
    callbackConfirmacaoModal = null;
}

function confirmarAcaoModal() {
    if (typeof callbackConfirmacaoModal === 'function') {
        callbackConfirmacaoModal();
    }
    fecharModal();
}

// Fechar modal ao clicar na área escura de fundo
window.onclick = function(event) {
    const modal = document.getElementById('custom-modal');
    if (event.target === modal) {
        fecharModal();
    }
};

// -------------------------------------------------------------
// 1. CARREGAR MATÉRIAS (GET /materia)
// -------------------------------------------------------------
async function carregarMaterias() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Erro ao buscar matérias');
        todasAsMaterias = await response.json();
        atualizarIndicadoresOrdenacao();
        filtrarEmTempoReal();
    } catch (error) {
        mostrarAviso('Falha ao carregar matérias do servidor', 'danger');
    }
}

// -------------------------------------------------------------
// 2. ORDENAÇÃO DINÂMICA DE COLUNAS (Default: ID Ascendente)
// -------------------------------------------------------------
function ordenarPor(coluna) {
    if (colunaAtual === coluna) {
        ordemAscendente = !ordemAscendente;
    } else {
        colunaAtual = coluna;
        ordemAscendente = true;
    }
    atualizarIndicadoresOrdenacao();
    filtrarEmTempoReal();
}

function atualizarIndicadoresOrdenacao() {
    const colunas = ['id', 'nome', 'professor', 'nota_media', 'aula_semana'];
    colunas.forEach(col => {
        const span = document.getElementById(`sort-${col}`);
        if (span) {
            if (col === colunaAtual) {
                span.innerText = ordemAscendente ? '▲' : '▼';
                span.style.opacity = '1';
            } else {
                span.innerText = '↕';
                span.style.opacity = '0.4';
            }
        }
    });
}

// -------------------------------------------------------------
// 3. FILTRAGEM E ORDENAÇÃO EM TEMPO REAL
// -------------------------------------------------------------
function filtrarEmTempoReal() {
    const searchInput = document.getElementById('search-professor');
    const termo = searchInput ? searchInput.value.toLowerCase().trim() : '';

    let filtradas = [...todasAsMaterias];

    if (termo) {
        filtradas = filtradas.filter(materia => {
            const professor = (materia.professor || '').toLowerCase();
            return professor.startsWith(termo);
        });
    }

    filtradas.sort((a, b) => {
        let valA = a[colunaAtual];
        let valB = b[colunaAtual];

        if (valA === null || valA === undefined) valA = '';
        if (valB === null || valB === undefined) valB = '';

        let comparacao = 0;
        if (typeof valA === 'number' && typeof valB === 'number') {
            comparacao = valA - valB;
        } else {
            comparacao = String(valA).localeCompare(String(valB), undefined, { numeric: true, sensitivity: 'base' });
        }

        return ordemAscendente ? comparacao : -comparacao;
    });

    renderizarTabela(filtradas);
}

function limparBusca() {
    const searchInput = document.getElementById('search-professor');
    if (searchInput) searchInput.value = '';
    filtrarEmTempoReal();
}

// -------------------------------------------------------------
// 4. RENDERIZAR TABELA
// -------------------------------------------------------------
function renderizarTabela(materias) {
    const tbody = document.getElementById('tabela-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (!materias || materias.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Nenhuma matéria encontrada.</td></tr>';
        return;
    }

    materias.forEach(materia => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
      <td>${materia.id}</td>
      <td>${escapeHtml(materia.nome || '-')}</td>
      <td>${escapeHtml(materia.professor || '-')}</td>
      <td>${materia.nota_media !== null && materia.nota_media !== undefined ? materia.nota_media : '-'}</td>
      <td>${materia.aula_semana !== null && materia.aula_semana !== undefined ? materia.aula_semana : '-'}</td>
      <td>
        <button type="button" class="btn-secondary" onclick="prepararEdicao(${materia.id})">Editar</button>
        <button type="button" class="btn-danger" onclick="abrirModalExclusao(${materia.id})">Deletar</button>
      </td>
    `;
        tbody.appendChild(tr);
    });
}

function escapeHtml(text) {
    if (!text) return '';
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// -------------------------------------------------------------
// 5. EXCLUSÃO COM MODAL
// -------------------------------------------------------------
function abrirModalExclusao(id) {
    const materia = todasAsMaterias.find(m => m.id === id);
    if (!materia) return;

    abrirModal({
        titulo: 'Confirmar Exclusão',
        mensagem: `Tem certeza que deseja remover a matéria do professor "${materia.professor}"?`,
        tipo: 'confirm',
        acaoConfirmar: () => deletarMateriaNoServidor(materia.professor)
    });
}

async function deletarMateriaNoServidor(professor) {
    try {
        const response = await fetch(`${API_URL}?professor=${encodeURIComponent(professor)}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Erro ao deletar');

        mostrarAviso('Matéria excluída com sucesso!');
        carregarMaterias();
    } catch (error) {
        abrirModal({
            titulo: 'Erro ao Excluir',
            mensagem: 'Não foi possível excluir a matéria.',
            tipo: 'erro'
        });
    }
}

// -------------------------------------------------------------
// 6. CADASTRAR OU ATUALIZAR (COM VALIDAÇÕES NO MODAL)
// -------------------------------------------------------------
function prepararEdicao(id) {
    const materia = todasAsMaterias.find(m => m.id === id);
    if (!materia) return;

    document.getElementById('materia-id').value = materia.id;
    document.getElementById('nome').value = materia.nome || '';
    document.getElementById('professor').value = materia.professor || '';
    document.getElementById('nota_media').value = materia.nota_media !== null && materia.nota_media !== undefined ? materia.nota_media : '';
    document.getElementById('aula_semana').value = materia.aula_semana !== null && materia.aula_semana !== undefined ? materia.aula_semana : '';

    document.getElementById('form-title').innerText = 'Editar Matéria';
    document.getElementById('btn-submit').innerText = 'Atualizar';
    document.getElementById('btn-cancel').style.display = 'inline-block';
}

document.getElementById('materia-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('materia-id').value;
    const nome = document.getElementById('nome').value.trim();
    const professor = document.getElementById('professor').value.trim();
    const notaVal = document.getElementById('nota_media').value;
    const aulaVal = document.getElementById('aula_semana').value;

    // Validação: Campos obrigatórios nulos ou vazios
    if (!nome || !professor) {
        abrirModal({
            titulo: 'Campo Obrigatório',
            mensagem: 'Por favor, preencha o Nome da Matéria e o Nome do Professor.',
            tipo: 'erro'
        });
        return;
    }

    // Validação: Nota Média fora do intervalo (0 a 10)
    if (notaVal !== '') {
        const notaNum = parseFloat(notaVal);
        if (isNaN(notaNum) || notaNum < 0 || notaNum > 10) {
            abrirModal({
                titulo: 'Nota Média Inválida',
                mensagem: 'A nota média deve ser um valor entre 0 e 10.',
                tipo: 'erro'
            });
            return;
        }
    }

    // Validação: Aulas por Semana (Apenas número inteiro)
    if (aulaVal !== '') {
        const aulaNum = Number(aulaVal);
        if (isNaN(aulaNum) || !Number.isInteger(aulaNum) || aulaNum < 1) {
            abrirModal({
                titulo: 'Valor Inválido',
                mensagem: 'O campo "Aulas por Semana" aceita apenas números inteiros (ex: 1, 2, 4).\nValores decimais não são permitidos.',
                tipo: 'erro'
            });
            return;
        }
    }

    const payload = {
        nome: nome,
        professor: professor,
        nota_media: notaVal !== '' ? parseFloat(notaVal) : null,
        aula_semana: aulaVal !== '' ? parseInt(aulaVal, 10) : null
    };

    try {
        let response;
        if (id) {
            response = await fetch(`${API_URL}?id=${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } else {
            response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        }

        if (!response.ok) throw new Error('Falha na requisição');

        mostrarAviso(id ? 'Matéria atualizada com sucesso!' : 'Matéria cadastrada com sucesso!');
        limparFormulario();
        carregarMaterias();
    } catch (error) {
        abrirModal({
            titulo: 'Erro ao Salvar',
            mensagem: 'Verifique se o nome da matéria ou o professor já estão cadastrados.',
            tipo: 'erro'
        });
    }
});

function limparFormulario() {
    document.getElementById('materia-form').reset();
    document.getElementById('materia-id').value = '';
    document.getElementById('form-title').innerText = 'Cadastrar Matéria';
    document.getElementById('btn-submit').innerText = 'Salvar';
    document.getElementById('btn-cancel').style.display = 'none';
}