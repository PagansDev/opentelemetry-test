const { trace } = require('@opentelemetry/api');
const { addSpanAttributes, recordSpanEvent } = require('./tracer');

const requestTracingMiddleware = (req, res, next) => {
  const span = trace.getActiveSpan();

  if (span) {
    const startTime = Date.now();

    addSpanAttributes({
      'http.method': req.method,
      'http.url': req.url,
      'http.route': req.route?.path || req.url,
      'http.user_agent': req.get('User-Agent'),
      'http.remote_addr': req.ip || req.connection.remoteAddress,
      'request.id':
        req.headers['x-request-id'] ||
        `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    });

    recordSpanEvent('http.request.start', {
      method: req.method,
      url: req.url,
      timestamp: startTime,
    });

    const originalSend = res.send;
    res.send = function (data) {
      const duration = Date.now() - startTime;

      addSpanAttributes({
        'http.status_code': res.statusCode,
        'http.response_size': data ? Buffer.byteLength(data, 'utf8') : 0,
        'http.duration_ms': duration,
        'http.success': res.statusCode < 400,
      });

      recordSpanEvent('http.request.complete', {
        status_code: res.statusCode,
        duration_ms: duration,
        response_size: data ? Buffer.byteLength(data, 'utf8') : 0,
      });

      return originalSend.call(this, data);
    };
  }

  next();
};

const errorTracingMiddleware = (error, req, res, next) => {
  const span = trace.getActiveSpan();

  if (span) {
    addSpanAttributes({
      'error.occurred': true,
      'error.type': error.constructor.name,
      'error.message': error.message,
      'http.status_code': error.status || 500,
    });

    recordSpanEvent('http.request.error', {
      error_type: error.constructor.name,
      error_message: error.message,
      status_code: error.status || 500,
    });

    span.recordException(error);
    span.setStatus({
      code: trace.SpanStatusCode.ERROR,
      message: error.message,
    });
  }

  next(error);
};

module.exports = {
  requestTracingMiddleware,
  errorTracingMiddleware,
};
