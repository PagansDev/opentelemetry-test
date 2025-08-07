const os = require('os');
const process = require('process');
const { addSpanAttributes, recordSpanEvent } = require('./tracer');

let lastCpuUsage = process.cpuUsage();
let lastCpuTime = Date.now();

const getSystemMetrics = () => {
  const memUsage = process.memoryUsage();
  const currentCpuUsage = process.cpuUsage();
  const currentTime = Date.now();

  const timeDiff = currentTime - lastCpuTime;
  const cpuDiff = {
    user: currentCpuUsage.user - lastCpuUsage.user,
    system: currentCpuUsage.system - lastCpuUsage.system,
  };

  const cpuPercent = {
    user: Math.round((cpuDiff.user / 1000 / timeDiff) * 100),
    system: Math.round((cpuDiff.system / 1000 / timeDiff) * 100),
    total: Math.round(
      ((cpuDiff.user + cpuDiff.system) / 1000 / timeDiff) * 100
    ),
  };

  lastCpuUsage = currentCpuUsage;
  lastCpuTime = currentTime;

  return {
    memory: {
      rss: Math.round(memUsage.rss / 1024 / 1024),
      heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
      heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
      external: Math.round(memUsage.external / 1024 / 1024),
      arrayBuffers: Math.round(memUsage.arrayBuffers / 1024 / 1024),
    },

    cpu: {
      user: Math.round(currentCpuUsage.user / 1000),
      system: Math.round(currentCpuUsage.system / 1000),
      userPercent: cpuPercent.user,
      systemPercent: cpuPercent.system,
      totalPercent: cpuPercent.total,
      loadAverage: os.loadavg(),
      cores: os.cpus().length,
    },

    system: {
      platform: os.platform(),
      arch: os.arch(),
      uptime: Math.round(os.uptime()),
      freeMemory: Math.round(os.freemem() / 1024 / 1024),
      totalMemory: Math.round(os.totalmem() / 1024 / 1024),
    },

    process: {
      pid: process.pid,
      uptime: Math.round(process.uptime()),
      version: process.version,
      title: process.title,
    },
  };
};

const addSystemMetricsToSpan = () => {
  const metrics = getSystemMetrics();

  addSpanAttributes({
    'system.memory.rss_mb': metrics.memory.rss,
    'system.memory.heap_used_mb': metrics.memory.heapUsed,
    'system.memory.heap_total_mb': metrics.memory.heapTotal,
    'system.memory.free_mb': metrics.system.freeMemory,
    'system.memory.total_mb': metrics.system.totalMemory,
    'system.memory.usage_percent': Math.round(
      (metrics.memory.rss / metrics.system.totalMemory) * 100
    ),

    'system.cpu.cores': metrics.cpu.cores,
    'system.cpu.user_percent': metrics.cpu.userPercent,
    'system.cpu.system_percent': metrics.cpu.systemPercent,
    'system.cpu.total_percent': metrics.cpu.totalPercent,
    'system.cpu.load_1m': metrics.cpu.loadAverage[0],
    'system.cpu.load_5m': metrics.cpu.loadAverage[1],
    'system.cpu.load_15m': metrics.cpu.loadAverage[2],

    'process.uptime_seconds': metrics.process.uptime,
    'process.pid': metrics.process.pid,
    'process.node_version': metrics.process.version,
  });

  recordSpanEvent('system.metrics.collected', {
    memory_mb: metrics.memory.rss,
    cpu_total_percent: metrics.cpu.totalPercent,
    cpu_user_percent: metrics.cpu.userPercent,
    cpu_system_percent: metrics.cpu.systemPercent,
    uptime: metrics.process.uptime,
  });
};

module.exports = {
  getSystemMetrics,
  addSystemMetricsToSpan,
};
