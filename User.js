const mongoose = require('mongoose')

// Um único modelo com discriminador "role": paciente | medico | admin.
// Campos específicos de cada perfil são validados no controller.
const userSchema = new mongoose.Schema({
  nome: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  senha: { type: String, required: true },
  role: {
    type: String,
    enum: ['paciente', 'medico', 'admin'],
    default: 'paciente'
  },

  // Médico
  crm: { type: String, trim: true },
  especialidade: { type: String, trim: true },

  // Paciente
  cpf: { type: String, trim: true },
  dataNascimento: { type: Date },
  telefone: { type: String, trim: true }
}, {
  timestamps: true
})

module.exports = mongoose.model('User', userSchema)
