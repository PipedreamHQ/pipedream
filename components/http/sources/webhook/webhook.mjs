import http from "../../http.app.mjs";

/**
 * Webhook source — receives incoming HTTP requests and triggers workflows.
 */
export default {
  key: "http-webhook",
  name: "New Webhook Request",
  description: "Emit new event when an HTTP request is received at the webhook URL. Use as a trigger to run workflows from external services (GitHub, Stripe, n8n, etc.). Configure response code, body, and which HTTP methods to accept.",
  version: "0.0.1",
  type: "source",
  props: {
    httpInterface: {
      type: "$.interface.http",
      customResponse: true,
    },
    httpMethod: {
      type: "string[]",
      label: "HTTP Method",
      description: "Only accept these HTTP methods. Requests with other methods receive 405.",
      options: [
        {
          label: "GET",
          value: "GET",
        },
        {
          label: "POST",
          value: "POST",
        },
        {
          label: "PUT",
          value: "PUT",
        },
        {
          label: "PATCH",
          value: "PATCH",
        },
        {
          label: "DELETE",
          value: "DELETE",
        },
        {
          label: "HEAD",
          value: "HEAD",
        },
      ],
      optional: true,
    },
    emitData: {
      type: "string",
      label: "Emit",
      description: "What to emit as the event payload",
      options: [
        {
          label: "Full request (method, path, headers, query, body)",
          value: "full",
        },
        {
          label: "Body only (parsed JSON/form)",
          value: "body",
        },
        {
          label: "Raw body (unparsed string, for JSON/XML verification)",
          value: "bodyRaw",
        },
      ],
      default: "full",
    },
    resRespond: {
      type: "string",
      label: "Respond",
      description: "When to send the HTTP response",
      options: [
        {
          label: "Immediately",
          value: "immediately",
        },
        {
          label: "No response body (status only)",
          value: "noBody",
        },
      ],
      default: "immediately",
    },
    resStatusCode: {
      type: "string",
      label: "Response Status Code",
      description: "HTTP status code to return",
      optional: true,
      default: "200",
      options: [
        {
          label: "200 OK",
          value: "200",
        },
        {
          label: "201 Created",
          value: "201",
        },
        {
          label: "202 Accepted",
          value: "202",
        },
        {
          label: "204 No Content",
          value: "204",
        },
        {
          label: "400 Bad Request",
          value: "400",
        },
      ],
    },
    resContentType: {
      type: "string",
      label: "Response Content-Type",
      description: "Content-Type of the response body (ignored when Respond is No response body)",
      optional: true,
      default: "application/json",
      options: [
        {
          label: "application/json",
          value: "application/json",
        },
        {
          label: "text/plain",
          value: "text/plain",
        },
        {
          label: "text/html",
          value: "text/html",
        },
      ],
    },
    resBody: {
      type: "string",
      label: "Response Body",
      description: "Body to return (ignored when Respond is No response body or status is 204)",
      optional: true,
      default: "{\"success\": true}",
    },
    http,
    summary: {
      propDefinition: [
        http,
        "summary",
      ],
    },
  },
  async run(event) {
    const allowedMethods = this.httpMethod;
    if (allowedMethods?.length && !allowedMethods.includes(event.method)) {
      this.httpInterface.respond({
        status: 405,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          error: "Method Not Allowed",
          message: `This webhook accepts ${allowedMethods.join(", ")} only`,
        }),
      });
      return;
    }

    const summary = this.summary
      ? this.http.interpolateSummary(this.summary, event)
      : `${event.method} ${event.path}`;

    const respondNoBody = this.resRespond === "noBody" || this.resStatusCode === "204";
    const responseConfig = {
      status: this.resStatusCode,
      headers: {},
    };
    if (!respondNoBody) {
      responseConfig.headers["content-type"] = this.resContentType;
      responseConfig.body = this.resBody;
    }

    this.httpInterface.respond(responseConfig);

    let payload;
    if (this.emitData === "body") {
      payload = event.body ?? {};
    } else if (this.emitData === "bodyRaw") {
      payload = {
        bodyRaw: event.bodyRaw ?? "",
      };
    } else {
      payload = event;
    }

    this.$emit(payload, {
      summary,
    });
  },
};
