import {
  BasicTracerProvider, SimpleSpanProcessor,
} from "@opentelemetry/sdk-trace-base";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";
import { SpanStatusCode } from "@opentelemetry/api";
import {
  loggingErrorHandler, setGlobalErrorHandler,
} from "@opentelemetry/core";
import { axios } from "@pipedream/platform";
import { LEVEL_NUMBERS } from "./common/constants.mjs";

export default {
  type: "app",
  app: "logfire",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return this.$auth.api_url;
    },
    _readToken() {
      return this.$auth.read_token;
    },
    _writeToken() {
      return this.$auth.write_token;
    },
    async recordLogEntry({
      message, level = "info", spanName, serviceName = "pipedream", attributes = {}, exceptionType, exceptionMessage,
    }) {
      const isException = Boolean(exceptionType || exceptionMessage);

      const exporter = new OTLPTraceExporter({
        url: `${this._baseUrl()}/v1/traces`,
        headers: {
          Authorization: `Bearer ${this._writeToken()}`,
        },
      });

      const provider = new BasicTracerProvider({
        resource: resourceFromAttributes({
          [ATTR_SERVICE_NAME]: serviceName,
        }),
        spanProcessors: [
          new SimpleSpanProcessor(exporter),
        ],
      });

      const tracer = provider.getTracer("pipedream-logfire-record-log-entry");
      const span = tracer.startSpan(spanName || message);

      span.setAttribute("logfire.msg", message);
      span.setAttribute("logfire.level_num", LEVEL_NUMBERS[level]);
      for (const [
        key,
        value,
      ] of Object.entries(attributes)) {
        span.setAttribute(key, value);
      }

      if (isException) {
        span.recordException({
          name: exceptionType || "Error",
          message: exceptionMessage || "",
        });
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: exceptionMessage || message,
        });
      }

      span.end();

      // SimpleSpanProcessor swallows export failures via OTel's global error
      // handler instead of rejecting forceFlush()/shutdown(), so without this
      // hook a failed write (bad token, 429, network error) would silently
      // report success. setGlobalErrorHandler mutates process-wide state, so
      // restore the SDK's own default once this call is done to avoid
      // leaking the closure into later invocations of a warm container.
      let exportError;
      setGlobalErrorHandler((err) => {
        exportError = err;
      });

      try {
        try {
          await provider.forceFlush();
        } finally {
          await provider.shutdown();
        }
      } finally {
        setGlobalErrorHandler(loggingErrorHandler());
      }

      if (exportError) {
        throw exportError;
      }

      return {
        message,
        level,
        serviceName,
        isException,
      };
    },
    async _makeRequest({
      $ = this, path, headers, maxRetries = 4, ...otherOpts
    }) {
      for (let attempt = 0; ; attempt += 1) {
        try {
          return await axios($, {
            url: `${this._baseUrl()}${path}`,
            ...otherOpts,
            headers: {
              Authorization: `Bearer ${this._readToken()}`,
              Accept: "application/json",
              ...headers,
            },
          });
        } catch (err) {
          if (err?.response?.status !== 429 || attempt >= maxRetries) {
            throw err;
          }
          // Logfire's query API enforces a per-minute quota and doesn't send
          // a Retry-After header, so back off long enough for that window to
          // clear rather than failing fast.
          const retryAfterSecs = Number(err.response.headers?.["retry-after"]);
          const delayMs = Number.isFinite(retryAfterSecs)
            ? retryAfterSecs * 1000
            : Math.min(5000 * (2 ** attempt), 30000);
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
      }
    },
    async runQuery({
      $, sql, minTimestamp, maxTimestamp, limit,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/v2/query",
        data: {
          sql,
          min_timestamp: minTimestamp,
          max_timestamp: maxTimestamp,
          limit,
        },
      });
    },
  },
};
