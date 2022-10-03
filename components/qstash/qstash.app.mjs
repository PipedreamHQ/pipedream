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
    topicId: {
      type: "string",
      label: "Topic",
      description: "The ID of th QStash topic.",
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
    topicName: {
      type: "string",
      label: "Topic Name",
      description: "The name of the topic.",
    },
    endpointUrl: {
      type: "string",
      label: "Endpoint URL",
      description: "User controlled service url where we will send webhooks to.",
    },
  },
  methods: {
    baseUrl() {
      return "https://qstash.upstash.io/v1";
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
        url: `${this.baseUrl()}/publish/${endpoint}`,
        method: "POST",
        data: body,
        headers: this.getHeaders(headers),
      });
    },
    async publishTopicMessage({
      $, body, topic, ...headers
    }) {
      return axios($, {
        url: `${this.baseUrl()}/publish/${topic}`,
        method: "POST",
        data: body,
        headers: this.getHeaders(headers),
      });
    },
    async listEndpoints({ $ }) {
      return axios($ || this, {
        url: `${this.baseUrl()}/endpoints`,
        method: "GET",
        headers: this.getHeaders({}),
      });
    },
    async listTopics({ $ = this }) {
      return axios($, {
        url: `${this.baseUrl()}/topics`,
        method: "GET",
        headers: this.getHeaders({}),
      });
    },
    async createTopic({
      $, topicName,
    }) {
      return axios($, {
        url: `${this.baseUrl()}/topics`,
        method: "POST",
        data: {
          name: topicName,
        },
        headers: this.getHeaders({}),
      });
    },
    async createEndpoint({
      $, topicName, topicId, endpointUrl,
    }) {
      return axios($, {
        url: `${this.baseUrl()}/endpoints`,
        method: "POST",
        data: {
          topicName,
          topicId,
          url: endpointUrl,
        },
        headers: this.getHeaders({}),
      });
    },
    async deleteEndpoint({
      $ = this, endpointId,
    }) {
      return axios($, {
        url: `${this.baseUrl()}/endpoints/${endpointId}`,
        method: "DELETE",
        headers: this.getHeaders({}),
      });
    },
    async getKeys({ $ = this }) {
      return axios($, {
        url: `${this.baseUrl()}/keys`,
        method: "GET",
        headers: this.getHeaders({}),
      });
    },
  },
};
