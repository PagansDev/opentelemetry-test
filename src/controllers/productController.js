const { Product } = require('../db');
const {
  withSpan,
  addSpanAttributes,
  recordSpanEvent,
} = require('../otel/tracer');
const { addSystemMetricsToSpan } = require('../otel/metrics');

let productCallCount = 0;

class ProductController {
  static getAllProducts = withSpan(
    'product.get_all',
    async (req, res) => {
      try {
        addSpanAttributes({
          'http.method': req.method,
          'http.route': '/api/products',
          'operation.type': 'database.query',
        });

        recordSpanEvent('database.query.start', { table: 'products' });
        const products = await Product.findAll({ where: { deleted: 0 } });

        addSpanAttributes({
          'database.products.count': products.length,
          'operation.success': true,
        });

        recordSpanEvent('database.query.complete', {
          count: products.length,
          duration_ms: Date.now() - Date.now(),
        });

        res.json(products);
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

  static createProduct = withSpan('product.create', async (req, res) => {
    try {
      const { name, price, description, isAvailable } = req.body;

      addSpanAttributes({
        'http.method': req.method,
        'http.route': '/api/products',
        'operation.type': 'database.insert',
        'product.name': name,
        'product.price': price,
      });

      if (!name || !price) {
        addSpanAttributes({
          'validation.error': true,
          'validation.missing_fields':
            !name && !price ? 'name,price' : !name ? 'name' : 'price',
        });
        return res.status(400).json({ error: 'Nome e preço são obrigatórios' });
      }

      recordSpanEvent('product.validation.success');

      const product = await Product.create({
        name,
        price,
        description,
        isAvailable: isAvailable !== undefined ? isAvailable : 1,
      });

      addSpanAttributes({
        'product.id': product.id,
        'operation.success': true,
      });

      recordSpanEvent('product.created', {
        id: product.id,
        name: product.name,
      });

      res.status(201).json(product);
    } catch (error) {
      addSpanAttributes({
        'operation.success': false,
        'error.type': error.constructor.name,
      });
      res.status(500).json({ error: error.message });
    }
  });

  static performanceTest = withSpan(
    'product.performance_test',
    async (req, res) => {
      const startTime = Date.now();
      productCallCount++;

      addSpanAttributes({
        'http.method': req.method,
        'http.route': '/api/products/performance-test',
        'performance.call_number': productCallCount,
        'performance.test_type':
          productCallCount === 1
            ? 'optimized'
            : productCallCount === 2
            ? 'heavy'
            : 'reset',
      });

      recordSpanEvent('performance.test.start', {
        call_number: productCallCount,
        timestamp: startTime,
      });

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

        addSpanAttributes({
          'performance.execution_time_ms': executionTime,
          'operation.success': false,
          'error.type': error.constructor.name,
        });

        recordSpanEvent('performance.test.error', {
          execution_time: executionTime,
          call_number: productCallCount,
          error: error.message,
        });

        res.status(500).json({
          error: error.message,
          executionTime: `${executionTime}ms`,
          callNumber: productCallCount,
        });
      }
    }
  );

  static _handleOptimizedResponse = withSpan(
    'product.optimized_response',
    async (req, res, startTime) => {
      addSpanAttributes({
        'performance.type': 'optimized',
        'performance.products_count': 1000,
        'memory.allocation': 'in_memory_generation',
      });

      recordSpanEvent('data.generation.start', {
        count: 1000,
        type: 'optimized',
      });

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

      addSpanAttributes({
        'performance.execution_time_ms': executionTime,
        'performance.throughput_items_per_ms': Math.round(1000 / executionTime),
        'operation.success': true,
      });

      recordSpanEvent('data.generation.complete', {
        execution_time: executionTime,
        items_generated: products.length,
      });

      res.json({
        callNumber: productCallCount,
        performance: 'OTIMIZADA',
        executionTime: `${executionTime}ms`,
        totalProducts: products.length,
        products: products,
        message: 'Resposta super rápida com dados em memória',
      });
    }
  );

  static _handleHeavyProcessing = withSpan(
    'product.heavy_processing',
    async (req, res, startTime) => {
      addSpanAttributes({
        'performance.type': 'heavy',
        'performance.products_count': 1000,
        'performance.calculations_per_item': 10000,
        'performance.delay_per_item_ms': 2,
      });

      recordSpanEvent('heavy.processing.start', {
        items_to_process: 1000,
        calculations_per_item: 10000,
      });

      const products = [];

      for (let i = 0; i < 1000; i++) {
        if (i % 100 === 0) {
          recordSpanEvent('heavy.processing.progress', {
            items_processed: i,
            percentage: Math.round((i / 1000) * 100),
          });
          addSystemMetricsToSpan();
        }

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

      addSpanAttributes({
        'performance.execution_time_ms': executionTime,
        'performance.throughput_items_per_ms': Math.round(1000 / executionTime),
        'performance.total_calculations': 1000 * 10000,
        'performance.average_time_per_item_ms': executionTime / 1000,
        'operation.success': true,
      });

      recordSpanEvent('heavy.processing.complete', {
        execution_time: executionTime,
        items_processed: products.length,
        total_calculations: 1000 * 10000,
      });

      res.json({
        callNumber: productCallCount,
        performance: 'PESADA',
        executionTime: `${executionTime}ms`,
        totalProducts: products.length,
        products: products,
        message: 'Processamento pesado com cálculos desnecessários',
      });
    }
  );

  static _handleNotFoundAndReset = withSpan(
    'product.reset_counter',
    (req, res, startTime) => {
      const executionTime = Date.now() - startTime;

      addSpanAttributes({
        'performance.type': 'reset',
        'performance.call_number': productCallCount,
        'performance.execution_time_ms': executionTime,
        'http.status_code': 404,
        'operation.type': 'counter_reset',
      });

      recordSpanEvent('counter.reset', {
        previous_count: productCallCount,
        execution_time: executionTime,
      });

      productCallCount = 0;

      addSpanAttributes({
        'counter.new_value': productCallCount,
        'operation.success': true,
      });

      res.status(404).json({
        error: 'Endpoint temporariamente indisponível',
        callNumber: 3,
        performance: 'INDISPONÍVEL',
        executionTime: `${executionTime}ms`,
        message: 'Contador resetado. Próxima chamada será otimizada novamente.',
        nextCall: 'A próxima chamada será a primeira (otimizada)',
      });
    }
  );

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
