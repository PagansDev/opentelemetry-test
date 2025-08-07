const { trace, SpanStatusCode } = require('@opentelemetry/api');

const tracer = trace.getTracer('opentelemetry-test-api', '1.0.0');

const withSpan = (spanName, fn, options = {}) => {
  return async (...args) => {
    return tracer.startActiveSpan(spanName, options, async (span) => {
      try {
        const result = await fn(...args);

        if (options.setResult && result) {
          span.setAttributes({
            'operation.result.count': Array.isArray(result) ? result.length : 1,
            'operation.success': true,
          });
        }

        span.setStatus({ code: SpanStatusCode.OK });
        return result;
      } catch (error) {
        span.recordException(error);
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: error.message,
        });
        throw error;
      } finally {
        span.end();
      }
    });
  };
};

const addSpanAttributes = (attributes) => {
  const activeSpan = trace.getActiveSpan();
  if (activeSpan) {
    activeSpan.setAttributes(attributes);
  }
};

const recordSpanEvent = (name, attributes = {}) => {
  const activeSpan = trace.getActiveSpan();
  if (activeSpan) {
    activeSpan.addEvent(name, attributes);
  }
};

module.exports = {
  tracer,
  withSpan,
  addSpanAttributes,
  recordSpanEvent,
};
