import http from "../../http.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "http-call-webhook",
  name: "Call Webhook",
  description: "Send an HTTP request to any webhook URL (for example an [n8n Webhook](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/) or similar). Optionally attach a shared **secret** as a Bearer token, query parameter, or `X-Webhook-Secret` header.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    http,
    url: {
      type: "string",
      label: "Webhook URL",
      description: "Full URL of the webhook (usually HTTPS)",
    },
    method: {
      type: "string",
      label: "HTTP Method",
      description: "Many webhook endpoints expect POST",
      options: [
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
      ],
      default: "POST",
    },
    body: {
      type: "object",
      label: "JSON Body",
      description: "Optional JSON payload (for POST, PUT, PATCH)",
      optional: true,
    },
    secret: {
      type: "string",
      label: "Secret",
      description: "Optional shared secret sent to the webhook for authentication",
      secret: true,
      optional: true,
    },
    secretDelivery: {
      type: "string",
      label: "Secret delivery",
      description: "How to send the secret when it is set",
      optional: true,
      options: [
        {
          label: "Authorization Bearer",
          value: "bearer",
        },
        {
          label: "Query parameter secret",
          value: "query",
        },
        {
          label: "Header X-Webhook-Secret",
          value: "x_header",
        },
      ],
      default: "bearer",
    },
  },
  async run({ $ }) {
    const method = this.method ?? "POST";
    const headers = {};

    if (this.body !== undefined && this.body !== null) {
      headers["Content-Type"] = "application/json";
    }

    const params = {};
    if (this.secret) {
      const mode = this.secretDelivery ?? "bearer";
      if (mode === "bearer") {
        headers.Authorization = `Bearer ${this.secret}`;
      } else if (mode === "query") {
        params.secret = this.secret;
      } else if (mode === "x_header") {
        headers["X-Webhook-Secret"] = this.secret;
      }
    }

    const config = {
      url: this.url,
      method,
      headers,
      ...(Object.keys(params).length > 0 && {
        params,
      }),
      ...((method === "POST" || method === "PUT" || method === "PATCH") &&
        this.body !== undefined && {
        data: this.body,
      }),
    };

    const response = await axios($, config);
    $.export("$summary", "Webhook request completed");
    return response;
  },
};
