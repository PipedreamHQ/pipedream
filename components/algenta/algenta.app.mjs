import { AlgentaClient } from "algenta-sdk";

export default {
  type: "app",
  app: "algenta",
  propDefinitions: {
    decisionId: {
      type: "string",
      label: "Decision ID",
      description: "The ID of the logged decision to act on, as returned when the decision was logged (e.g. `dec_3f8a2c91`).",
    },
    webhookUrl: {
      type: "string",
      label: "Webhook URL",
      description: "The URL the Algenta engine delivers the execution payload to — must be `https://` for remote hosts (e.g. `https://ops.example.com/hooks/algenta`); `http://` is accepted for loopback (e.g. `http://localhost:9000/hooks`). The execution receipt records the delivery status for this URL.",
    },
    timeoutSeconds: {
      type: "integer",
      label: "Timeout (seconds)",
      description: "Maximum time in seconds the engine waits for the webhook delivery before marking the execution as failed (1–3600; omit to use the engine default).",
      optional: true,
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "Additional key-value metadata to attach to the execution, as a JSON object (e.g. `{\"source\":\"support-triage\"}`).",
      optional: true,
    },
  },
  methods: {
    /**
     * Build an authenticated client for the Algenta HTTP API. Uses the connected
     * account's API key and, when configured, its custom base URL for self-hosted
     * engine deployments (defaults to Algenta Cloud).
     * @returns {AlgentaClient} an authenticated Algenta API client
     */
    _client() {
      const config = {
        apiKey: this.$auth.api_key,
      };
      if (this.$auth.base_url) {
        let parsed;
        try {
          parsed = new URL(this.$auth.base_url);
        } catch {
          throw new Error(`Algenta Base URL is not a valid URL: ${this.$auth.base_url}`);
        }
        const isLoopback = [
          "localhost",
          "127.0.0.1",
          "::1",
        ].includes(parsed.hostname);
        if (parsed.protocol !== "https:" && !(parsed.protocol === "http:" && isLoopback)) {
          throw new Error(
            "Algenta Base URL must use https:// for remote hosts; http:// is only allowed for loopback (localhost/127.0.0.1/::1).",
          );
        }
        config.baseUrl = this.$auth.base_url;
      }
      return new AlgentaClient(config);
    },
    /**
     * Execute a logged decision through the governed execution plane.
     * @param {string} decisionId - the ID of the logged decision to execute.
     * @param {object} request - the execution request (`webhook_url`, optional
     * `timeout_seconds` and `metadata`).
     * @returns {Promise<object>} the execution receipt for the delivery.
     */
    executeDecision(decisionId, request) {
      return this._client().executeDecision(decisionId, request);
    },
    /**
     * Fetch a logged decision record, including its execution and audit fields.
     * @param {string} decisionId - the ID of the decision to fetch.
     * @returns {Promise<object>} the decision record.
     */
    getDecision(decisionId) {
      return this._client().getDecision(decisionId);
    },
  },
};
