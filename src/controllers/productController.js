const { Product } = require('../db');

let productCallCount = 0;

class ProductController {
  static async getAllProducts(req, res) {
    try {
      const products = await Product.findAll({ where: { deleted: 0 } });
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createProduct(req, res) {
    try {
      const { name, price, description, isAvailable } = req.body;
      if (!name || !price) {
        return res.status(400).json({ error: 'Nome e preço são obrigatórios' });
      }
      const product = await Product.create({
        name,
        price,
        description,
        isAvailable: isAvailable !== undefined ? isAvailable : 1,
      });
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async performanceTest(req, res) {
    const startTime = Date.now();
    productCallCount++;

    try {
      if (productCallCount === 1) {
        return await ProductController._handleOptimizedResponse(
          req,
          res,
          startTime
        );
      } else if (productCallCount === 2) {
        return await ProductController._handleHeavyProcessing(
          req,
          res,
          startTime
        );
      } else {
        return ProductController._handleNotFoundAndReset(req, res, startTime);
      }
    } catch (error) {
      const executionTime = Date.now() - startTime;
      res.status(500).json({
        error: error.message,
        executionTime: `${executionTime}ms`,
        callNumber: productCallCount,
      });
    }
  }

  static async _handleOptimizedResponse(req, res, startTime) {
    const products = Array.from({ length: 1000 }, (_, i) => ({
      id: i + 1,
      name: `Produto Otimizado ${i + 1}`,
      price: Math.floor(Math.random() * 1000) + 10,
      description: `Descrição rápida do produto ${i + 1}`,
      isAvailable: 1,
      deleted: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    const executionTime = Date.now() - startTime;

    res.json({
      callNumber: productCallCount,
      performance: 'OTIMIZADA',
      executionTime: `${executionTime}ms`,
      totalProducts: products.length,
      products: products,
      message: 'Resposta super rápida com dados em memória',
    });
  }

  static async _handleHeavyProcessing(req, res, startTime) {
    const products = [];

    for (let i = 0; i < 1000; i++) {
      let heavyCalculation = 0;
      for (let j = 0; j < 10000; j++) {
        heavyCalculation += Math.sin(j) * Math.cos(j) * Math.sqrt(j);
      }

      await new Promise((resolve) => setTimeout(resolve, 2));

      let description = '';
      for (let k = 0; k < 100; k++) {
        description += `Descrição muito detalhada e custosa do produto ${
          i + 1
        } com processamento ${k}. `;
      }

      products.push({
        id: i + 1,
        name: `Produto Pesado ${i + 1}`,
        price: Math.floor(heavyCalculation % 1000) + 10,
        description: description.substring(0, 255),
        isAvailable: Math.random() > 0.5 ? 1 : 0,
        deleted: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        heavyCalculation: heavyCalculation,
      });
    }

    const executionTime = Date.now() - startTime;

    res.json({
      callNumber: productCallCount,
      performance: 'PESADA',
      executionTime: `${executionTime}ms`,
      totalProducts: products.length,
      products: products,
      message: 'Processamento pesado com cálculos desnecessários',
    });
  }

  static _handleNotFoundAndReset(req, res, startTime) {
    const executionTime = Date.now() - startTime;
    productCallCount = 0;

    res.status(404).json({
      error: 'Endpoint temporariamente indisponível',
      callNumber: 3,
      performance: 'INDISPONÍVEL',
      executionTime: `${executionTime}ms`,
      message: 'Contador resetado. Próxima chamada será otimizada novamente.',
      nextCall: 'A próxima chamada será a primeira (otimizada)',
    });
  }

  static resetCounter() {
    productCallCount = 0;
    return {
      message: 'Contador resetado com sucesso',
      counter: productCallCount,
    };
  }

  static getCounterStatus() {
    return {
      currentCount: productCallCount,
      nextBehavior:
        productCallCount === 0
          ? 'OTIMIZADA'
          : productCallCount === 1
          ? 'PESADA'
          : 'INDISPONÍVEL',
    };
  }
}

module.exports = ProductController;
