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
      description: "This id will be used to detect duplicate messages. If a duplicate message is detected, the request will be accepted but not enqueued.",
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
    getHeaders({
      deduplicationId, delay, cron, retries, contentBasedDeduplication,
    }) {
      return {
        "Authorization": `Bearer ${this.$auth.qstash_token}`,
        "Content-Type": "application/json",
        ...(contentBasedDeduplication
          ? {
            "Upstash-Content-Based-Deduplication": contentBasedDeduplication,
          }
          : {}),
        ...(deduplicationId
          ? {
            "Upstash-Content-Based-Deduplication": deduplicationId,
          }
          : {}),
        ...(delay
          ? {
            "Upstash-Delay": delay,
          }
          : {}),
        ...(cron
          ? {
            "Upstash-Cron": cron,
          }
          : {}),
        ...(retries
          ? {
            "Upstash-Retries": retries,
          }
          : {}),
      };
    },
    async publishEndpointMessage({
      $, body, endpoint, ...headers
    }) {
      const httpHeaders = this.getHeaders(headers);
      console.log(httpHeaders);
      return axios($, {
        url: `https://qstash.upstash.io/v1/publish/${endpoint}`,
        method: "POST",
        data: body,
        headers: httpHeaders,
      });
    },

    async publishTopicMessage({
      $, body, topic, ...headers
    }) {
      return await axios($, {
        url: `https://qstash.upstash.io/v1/publish/${topic}`,
        method: "POST",
        data: body,
        headers: this.getHeaders(headers),
      });
    },
  },
};
