const { getSystemMetrics } = require('../otel/metrics');
const { withSpan, addSpanAttributes } = require('../otel/tracer');

class MetricsController {
  static getSystemMetrics = withSpan('metrics.system', async (req, res) => {
    try {
      addSpanAttributes({
        'http.method': req.method,
        'http.route': '/api/metrics/system',
        'operation.type': 'system.monitoring',
      });

      const metrics = getSystemMetrics();

      addSpanAttributes({
        'system.memory.usage_mb': metrics.memory.rss,
        'system.cpu.total_percent': metrics.cpu.totalPercent,
        'system.cpu.user_percent': metrics.cpu.userPercent,
        'system.cpu.system_percent': metrics.cpu.systemPercent,
        'operation.success': true,
      });

      res.json({
        timestamp: new Date().toISOString(),
        metrics: metrics,
        health: {
          status:
            metrics.memory.rss < 500 && metrics.cpu.loadAverage[0] < 2
              ? 'healthy'
              : 'warning',
          memoryStatus: metrics.memory.rss < 500 ? 'ok' : 'high',
          cpuStatus: metrics.cpu.loadAverage[0] < 2 ? 'ok' : 'high',
        },
      });
    } catch (error) {
      addSpanAttributes({
        'operation.success': false,
        'error.type': error.constructor.name,
      });
      res.status(500).json({ error: error.message });
    }
  });
}

module.exports = MetricsController;
