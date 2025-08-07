const { Config } = require('../db');

class ConfigController {
  static async getAllConfigs(req, res) {
    try {
      const configs = await Config.findAll();
      res.json(configs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createConfig(req, res) {
    try {
      const { key, value } = req.body;
      if (!key) {
        return res.status(400).json({ error: 'Chave é obrigatória' });
      }
      const config = await Config.create({ key, value });
      res.status(201).json(config);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = ConfigController;
