const bearer = [{ bearerAuth: [] }]

const swaggerSpec = {
  openapi: '3.0.0',
  info: { title: 'Clínica - Médicos e Pacientes (JWT)', version: '2.0.0' },
  servers: [{ url: '/' }],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
    },
    schemas: {
      Cadastro: {
        type: 'object',
        required: ['nome', 'email', 'senha', 'role'],
        properties: {
          nome: { type: 'string' },
          email: { type: 'string' },
          senha: { type: 'string', minLength: 6 },
          role: { type: 'string', enum: ['paciente', 'medico'] },
          crm: { type: 'string', description: 'Obrigatório para médico' },
          especialidade: { type: 'string', description: 'Obrigatório para médico' },
          cpf: { type: 'string', description: 'Obrigatório para paciente' },
          dataNascimento: { type: 'string', format: 'date', description: 'Obrigatório para paciente' },
          telefone: { type: 'string' }
        }
      },
      Login: {
        type: 'object',
        required: ['email', 'senha'],
        properties: { email: { type: 'string' }, senha: { type: 'string' } }
      }
    }
  },
  paths: {
    '/api/auth/register': {
      post: {
        summary: 'Cadastra médico ou paciente',
        tags: ['Autenticação'],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Cadastro' } } } },
        responses: { 201: { description: 'Cadastrado' }, 400: { description: 'Dados inválidos' }, 409: { description: 'E-mail já cadastrado' } }
      }
    },
    '/api/auth/login': {
      post: {
        summary: 'Realiza login e retorna o JWT',
        tags: ['Autenticação'],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Login' } } } },
        responses: { 200: { description: 'Login realizado' }, 401: { description: 'Credenciais inválidas' } }
      }
    },
    '/api/auth/me': {
      get: {
        summary: 'Dados do usuário logado',
        tags: ['Autenticação'],
        security: bearer,
        responses: { 200: { description: 'Perfil do usuário' }, 401: { description: 'Não autenticado' } }
      }
    },
    '/api/medicos': {
      get: {
        summary: 'Lista médicos (qualquer usuário autenticado)',
        tags: ['Listagens'],
        security: bearer,
        responses: { 200: { description: 'Lista de médicos' } }
      }
    },
    '/api/pacientes': {
      get: {
        summary: 'Lista pacientes (somente médico ou admin)',
        tags: ['Listagens'],
        security: bearer,
        responses: { 200: { description: 'Lista de pacientes' }, 403: { description: 'Acesso negado' } }
      }
    }
  }
}

module.exports = swaggerSpec
