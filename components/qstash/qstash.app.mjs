import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "qstash",
  propDefinitions: {
    topic: {
      type: "string",
      label: "Topic",
      description: "Topics allow you to publish a single message to more than one API endpoints.",
    },
    endpoint: {
      type: "string",
      label: "Callback Endpoint",
      description: "The endpoint that will be receiving these events",
    },
    body: {
      type: "object",
      label: "Body",
      description: "The body is forwarded to your endpoints in the HTTP request",
    },
    retries: {
      type: "integer",
      label: "Retries",
      description: "How often should this messasge be retried in case the destination API is not available.",
      default: 3,
      optional: true,
    },
    deduplicationId: {
      type: "string",
      label: "Deduplication ID",
      description: "Provide an ID that will be used to detect duplicate messages. If a duplicate message is detected, the request will be accepted but not enqueued. [Learn more.](https://docs.upstash.com/qstash/howto/publishing#optional-parameters-and-configuration)",
      optional: true,
    },
    contentBasedDeduplicationEnabled: {
      type: "boolean",
      label: "Content Based Deduplication Enabled",
      description: "If true, the message content will get hashed and used as deduplication ID. If a duplicate message is detected, the request will be accepted but not enqueued.",
      optional: true,
    },
    delay: {
      type: "string",
      label: "Delay",
      description: "Format for this header is a number followed by duration abbreviation, like `10s`. Available durations are `s` (seconds), `m` (minutes), `h` (hours), `d` (days).",
      optional: true,
    },
    cron: {
      type: "string",
      label: "Cron",
      description: "You can use a tool like [Crontab.guru](https://crontab.guru) to generate cron expressions.",
      optional: true,
    },
  },
  methods: {
    baseUrl() {
      return "https://qstash.upstash.io/v1/publish";
    },
    getHeaders({
      deduplicationId, delay, cron, retries, contentBasedDeduplicationEnabled,
    }) {
      let headers = {
        "Authorization": `Bearer ${this.$auth.qstash_token}`,
        "Content-Type": "application/json",
      };
      if (contentBasedDeduplicationEnabled) {
        headers["Upstash-Content-Based-Deduplication"] = contentBasedDeduplicationEnabled;
      }
      if (deduplicationId) {
        headers["Upstash-Deduplication-Id"] = deduplicationId;
      }
      if (delay) {
        headers["Upstash-Delay"] = delay;
      }
      if (cron) {
        headers["Upstash-Cron"] = cron;
      }
      if (retries) {
        headers["Upstash-Retries"] = retries;
      }
      return headers;
    },
    async publishEndpointMessage({
      $, body, endpoint, ...headers
    }) {
      return axios($, {
        url: `${this.baseUrl()}/${endpoint}`,
        method: "POST",
        data: body,
        headers: this.getHeaders(headers),
      });
    },

    async publishTopicMessage({
      $, body, topic, ...headers
    }) {
      return axios($, {
        url: `${this.baseUrl()}/${topic}`,
        method: "POST",
        data: body,
        headers: this.getHeaders(headers),
      });
    },
  },
};
