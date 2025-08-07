const { tracer, addSpanAttributes, recordSpanEvent } = require('./tracer');

const withDatabaseSpan = (operation, tableName, fn) => {
  return async (...args) => {
    return tracer.startActiveSpan(
      `db.${operation}`,
      {
        attributes: {
          'db.operation': operation,
          'db.table': tableName,
          'db.system': 'mysql',
        },
      },
      async (span) => {
        const startTime = Date.now();

        try {
          recordSpanEvent(`db.${operation}.start`, {
            table: tableName,
            timestamp: startTime,
          });

          const result = await fn(...args);

          const duration = Date.now() - startTime;

          addSpanAttributes({
            'db.duration_ms': duration,
            'db.success': true,
            'db.rows_affected': Array.isArray(result)
              ? result.length
              : result
              ? 1
              : 0,
          });

          recordSpanEvent(`db.${operation}.complete`, {
            duration_ms: duration,
            rows_affected: Array.isArray(result)
              ? result.length
              : result
              ? 1
              : 0,
          });

          span.setStatus({ code: 1 });
          return result;
        } catch (error) {
          const duration = Date.now() - startTime;

          addSpanAttributes({
            'db.duration_ms': duration,
            'db.success': false,
            'db.error': error.message,
          });

          recordSpanEvent(`db.${operation}.error`, {
            duration_ms: duration,
            error: error.message,
          });

          span.recordException(error);
          span.setStatus({ code: 2, message: error.message });
          throw error;
        } finally {
          span.end();
        }
      }
    );
  };
};

const createDatabaseWrappers = (model, tableName) => {
  return {
    findAll: withDatabaseSpan('select', tableName, model.findAll.bind(model)),
    findOne: withDatabaseSpan('select', tableName, model.findOne.bind(model)),
    findByPk: withDatabaseSpan('select', tableName, model.findByPk.bind(model)),
    create: withDatabaseSpan('insert', tableName, model.create.bind(model)),
    update: withDatabaseSpan('update', tableName, model.update.bind(model)),
    destroy: withDatabaseSpan('delete', tableName, model.destroy.bind(model)),
    count: withDatabaseSpan('count', tableName, model.count.bind(model)),
  };
};

module.exports = {
  withDatabaseSpan,
  createDatabaseWrappers,
};
