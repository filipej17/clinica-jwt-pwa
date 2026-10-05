// Uso: roleMiddleware('medico', 'admin')
function roleMiddleware(...rolesPermitidas) {
  return (req, res, next) => {
    if (!rolesPermitidas.includes(req.user.role)) {
      return res.status(403).json({ mensagem: 'Acesso negado' })
    }
    next()
  }
}

module.exports = roleMiddleware
