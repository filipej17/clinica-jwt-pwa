const User = require('../models/User')

// Pacientes e médicos podem ver a lista de médicos (para escolher atendimento)
async function listarMedicos(req, res) {
  const medicos = await User.find({ role: 'medico' }).select('nome email crm especialidade')
  res.json(medicos)
}

// Somente médicos (e admin) veem pacientes
async function listarPacientes(req, res) {
  const pacientes = await User.find({ role: 'paciente' }).select('nome email cpf dataNascimento telefone')
  res.json(pacientes)
}

module.exports = { listarMedicos, listarPacientes }
