import http from "../../http.app.mjs";

// Core HTTP component
export default {
  key: "http-new-requests",
  name: "New Requests",
  description: "Get a URL and emit the full HTTP event on every request (including headers and query parameters). You can also configure the HTTP response code, body, and more.",
  version: "0.1.2",
  type: "source",
  props: {
    httpInterface: {
      type: "$.interface.http",
      customResponse: true,
    },
    emitBodyOnly: {
      type: "boolean",
      label: "Body Only",
      description: "This source emits an event representing the full HTTP request by default. Select `true` to emit the body only.",
      optional: true,
      default: false,
    },
    resStatusCode: {
      type: "string",
      label: "Response Status Code",
      description: "The status code to return in the HTTP response",
      optional: true,
      default: "200",
    },
    resContentType: {
      type: "string",
      label: "Response Content-Type",
      description: "The `Content-Type` of the body returned in the HTTP response",
      optional: true,
      default: "application/json",
    },
    resBody: {
      type: "string",
      label: "Response Body",
      description: "The body to return in the HTTP response",
      optional: true,
      default: "{ \"success\": true }",
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
    const summary = this.summary
      ? this.http.interpolateSummary(this.summary, event)
      : `${event.method} ${event.path}`;

    this.httpInterface.respond({
      status: this.resStatusCode,
      body: this.resBody,
      headers: {
        "content-type": this.resContentType,
      },
    });

    if (this.emitBodyOnly) {
      this.$emit(event.body, {
        summary,
      });
    } else {
      this.$emit(event, {
        summary,
      });
    }
  },
};
