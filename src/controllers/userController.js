const { User } = require('../db');
const {
  withSpan,
  addSpanAttributes,
  recordSpanEvent,
} = require('../otel/tracer');

class UserController {
  static getAllUsers = withSpan(
    'user.get_all',
    async (req, res) => {
      try {
        addSpanAttributes({
          'http.method': req.method,
          'http.route': '/api/users',
          'operation.type': 'database.query',
        });

        recordSpanEvent('database.query.start', { table: 'users' });
        const users = await User.findAll();

        addSpanAttributes({
          'database.users.count': users.length,
          'operation.success': true,
        });

        recordSpanEvent('database.query.complete', { count: users.length });

        res.json(users);
      } catch (error) {
        addSpanAttributes({
          'operation.success': false,
          'error.type': error.constructor.name,
        });
        res.status(500).json({ error: error.message });
      }
    },
    { setResult: true }
  );

  static createUser = withSpan('user.create', async (req, res) => {
    try {
      const { name } = req.body;

      addSpanAttributes({
        'http.method': req.method,
        'http.route': '/api/users',
        'operation.type': 'database.insert',
        'user.name': name,
      });

      if (!name) {
        addSpanAttributes({
          'validation.error': true,
          'validation.missing_fields': 'name',
        });
        return res.status(400).json({ error: 'Nome é obrigatório' });
      }

      recordSpanEvent('user.validation.success');

      const user = await User.create({ name });

      addSpanAttributes({
        'user.id': user.id,
        'operation.success': true,
      });

      recordSpanEvent('user.created', { id: user.id, name: user.name });

      res.status(201).json(user);
    } catch (error) {
      addSpanAttributes({
        'operation.success': false,
        'error.type': error.constructor.name,
      });
      res.status(500).json({ error: error.message });
    }
  });
}

module.exports = UserController;
