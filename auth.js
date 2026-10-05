const api = '/api'

function alternarPerfil() {
  const medico = document.getElementById('roleCadastro').value === 'medico'
  document.getElementById('camposMedico').hidden = !medico
  document.getElementById('camposPaciente').hidden = medico
}

async function cadastrar() {
  const status = document.getElementById('statusCadastro')
  const role = document.getElementById('roleCadastro').value

  const body = {
    role,
    nome: document.getElementById('nomeCadastro').value,
    email: document.getElementById('emailCadastro').value,
    senha: document.getElementById('senhaCadastro').value
  }

  if (role === 'medico') {
    body.crm = document.getElementById('crmCadastro').value
    body.especialidade = document.getElementById('especialidadeCadastro').value
  } else {
    body.cpf = document.getElementById('cpfCadastro').value
    body.dataNascimento = document.getElementById('nascimentoCadastro').value
    body.telefone = document.getElementById('telefoneCadastro').value
  }

  try {
    const resposta = await fetch(`${api}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    const dados = await resposta.json()

    status.innerText = resposta.ok
      ? `${dados.nome} cadastrado(a) com sucesso. Faça login.`
      : dados.mensagem
  } catch (erro) {
    status.innerText = 'Não foi possível conectar ao servidor'
  }
}

async function login() {
  const status = document.getElementById('statusLogin')

  try {
    const resposta = await fetch(`${api}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: document.getElementById('emailLogin').value,
        senha: document.getElementById('senhaLogin').value
      })
    })
    const dados = await resposta.json()

    if (!resposta.ok) {
      localStorage.removeItem('token')
      localStorage.removeItem('usuario')
      status.innerText = dados.mensagem
      return
    }

    localStorage.setItem('token', dados.token)
    localStorage.setItem('usuario', JSON.stringify(dados.usuario))
    window.location.href = '/painel.html'
  } catch (erro) {
    status.innerText = 'Não foi possível conectar ao servidor'
  }
}

alternarPerfil()

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
}
