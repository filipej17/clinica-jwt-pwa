const api = '/api'
const token = localStorage.getItem('token')
const usuario = JSON.parse(localStorage.getItem('usuario') || 'null')

if (!token || !usuario) {
  window.location.href = '/'
}

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('usuario')
  window.location.href = '/'
}

// Evita injeção de HTML com dados vindos da API
function esc(texto) {
  const el = document.createElement('div')
  el.textContent = texto == null ? '' : String(texto)
  return el.innerHTML
}

function linha(rotulo, valor) {
  return valor ? `<span><strong>${rotulo}:</strong> ${esc(valor)}</span>` : ''
}

function itemPessoa(titulo, detalhes) {
  return `
    <article class="user-item">
      <div class="user-info">
        <div class="avatar">${esc(titulo.charAt(0).toUpperCase())}</div>
        <div>
          <strong>${esc(titulo)}</strong>
          ${detalhes.join('')}
        </div>
      </div>
    </article>`
}

async function buscar(caminho) {
  const resposta = await fetch(`${api}${caminho}`, {
    headers: { Authorization: `Bearer ${token}` }
  })

  if (resposta.status === 401) {
    logout()
    return null
  }
  if (!resposta.ok) return null
  return resposta.json()
}

function desenharPerfil(u) {
  const detalhes = [linha('E-mail', u.email)]

  if (u.role === 'medico') {
    detalhes.push(linha('CRM', u.crm), linha('Especialidade', u.especialidade))
  } else if (u.role === 'paciente') {
    detalhes.push(
      linha('CPF', u.cpf),
      linha('Nascimento', u.dataNascimento && new Date(u.dataNascimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' })),
      linha('Telefone', u.telefone)
    )
  }

  document.getElementById('perfil').innerHTML = itemPessoa(u.nome, detalhes)
}

async function iniciar() {
  const eu = await buscar('/auth/me')
  if (!eu) return

  const ehMedico = eu.role === 'medico'
  const ehAdmin = eu.role === 'admin'

  document.getElementById('perfilTopo').innerText = ehMedico ? 'Área do médico' : ehAdmin ? 'Administrador' : 'Área do paciente'
  document.getElementById('eyebrow').innerText = ehMedico ? 'Médico' : ehAdmin ? 'Admin' : 'Paciente'
  document.getElementById('boasVindas').innerText = `Olá, ${eu.nome}`
  document.getElementById('descricao').innerText = ehMedico || ehAdmin
    ? 'Consulte os pacientes cadastrados.'
    : 'Consulte os médicos disponíveis.'

  desenharPerfil(eu)

  const verPacientes = ehMedico || ehAdmin
  document.getElementById('tituloLista').innerText = verPacientes ? 'Pacientes cadastrados' : 'Médicos cadastrados'

  const itens = await buscar(verPacientes ? '/pacientes' : '/medicos')
  const lista = document.getElementById('lista')

  if (!itens || itens.length === 0) {
    lista.innerHTML = '<p class="muted">Nenhum registro encontrado.</p>'
    return
  }

  lista.innerHTML = itens.map(p => verPacientes
    ? itemPessoa(p.nome, [linha('E-mail', p.email), linha('CPF', p.cpf), linha('Telefone', p.telefone)])
    : itemPessoa(p.nome, [linha('Especialidade', p.especialidade), linha('CRM', p.crm), linha('E-mail', p.email)])
  ).join('')
}

iniciar()

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
}
