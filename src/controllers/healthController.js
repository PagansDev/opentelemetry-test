const { sequelize } = require('../db');

class HealthController {
  static getServerStatus(req, res) {
    res.json({
      message: 'Servidor funcionando',
      timestamp: new Date().toISOString(),
    });
  }

  static async healthCheck(req, res) {
    try {
      await sequelize.authenticate();
      res.json({ status: 'healthy' });
    } catch (error) {
      res.status(500).json({ status: 'unhealthy', error: error.message });
    }
  }
}

module.exports = HealthController;
