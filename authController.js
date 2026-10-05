const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Apenas esses perfis podem ser criados pelo cadastro público.
// "admin" nunca é aceito aqui (evita escalonamento de privilégio).
const PERFIS_PUBLICOS = ['paciente', 'medico']

function dadosPublicos(user) {
  return {
    id: user._id,
    nome: user.nome,
    email: user.email,
    role: user.role,
    crm: user.crm,
    especialidade: user.especialidade,
    cpf: user.cpf,
    dataNascimento: user.dataNascimento,
    telefone: user.telefone
  }
}

async function register(req, res) {
  try {
    const { nome, email, senha, role, crm, especialidade, cpf, dataNascimento, telefone } = req.body

    if (!nome || !email || !senha) {
      return res.status(400).json({ mensagem: 'Nome, e-mail e senha são obrigatórios' })
    }
    if (senha.length < 6) {
      return res.status(400).json({ mensagem: 'A senha deve ter pelo menos 6 caracteres' })
    }
    if (!PERFIS_PUBLICOS.includes(role)) {
      return res.status(400).json({ mensagem: 'Perfil deve ser "paciente" ou "medico"' })
    }

    const dados = { nome, email, role, senha: await bcrypt.hash(senha, 10) }

    if (role === 'medico') {
      if (!crm || !especialidade) {
        return res.status(400).json({ mensagem: 'Médico deve informar CRM e especialidade' })
      }
      dados.crm = crm
      dados.especialidade = especialidade
    } else {
      if (!cpf || !dataNascimento) {
        return res.status(400).json({ mensagem: 'Paciente deve informar CPF e data de nascimento' })
      }
      dados.cpf = cpf
      dados.dataNascimento = dataNascimento
      dados.telefone = telefone
    }

    const user = await User.create(dados)
    res.status(201).json(dadosPublicos(user))
  } catch (erro) {
    if (erro.code === 11000) {
      return res.status(409).json({ mensagem: 'E-mail já cadastrado' })
    }
    res.status(500).json({ mensagem: 'Erro ao cadastrar' })
  }
}

async function login(req, res) {
  try {
    const { email, senha } = req.body

    if (!email || !senha) {
      return res.status(400).json({ mensagem: 'Informe e-mail e senha' })
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() })
    const senhaValida = user && await bcrypt.compare(senha, user.senha)

    if (!senhaValida) {
      return res.status(401).json({ mensagem: 'E-mail ou senha inválidos' })
    }

    const token = jwt.sign(
      { id: user._id, nome: user.nome, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )

    res.json({ token, usuario: dadosPublicos(user) })
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao fazer login' })
  }
}

async function me(req, res) {
  const user = await User.findById(req.user.id).select('-senha')
  if (!user) return res.status(404).json({ mensagem: 'Usuário não encontrado' })
  res.json(dadosPublicos(user))
}

module.exports = { register, login, me }
