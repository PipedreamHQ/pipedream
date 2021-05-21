const http_app = require('../../http.app.js')

// Core HTTP component
module.exports = {
  key: "http-new-requests",
  name: "New Requests",
  description: "Get a URL and emit the full HTTP event on every request (including headers and query parameters). You can also configure the HTTP response code, body, and more.",
  version: "0.0.2",
  props: {
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    emitBodyOnly: {
      type: "boolean",
      label: "Body Only",
      description: "This source emits an event representing the full HTTP request by default. Select TRUE to emit the body only.",
      optional: true,
      default: false,
    },
    resStatusCode: {
      type: "string",
      label: "Response Status Code",
      description: "The status code to return in the HTTP response.",
      optional: true,
      default: '200',
    },
    resContentType: {
      type: "string",
      label: "Response Content-Type",
      description: "The content-type of the body returned in the HTTP response.",
      optional: true,
      default: `application/json`,
    },
    resBody: {
      type: "string",
      label: "Response Body",
      description: "The body to return in the HTTP response.",
      optional: true,
      default: `{ "success": true }`,
    },
    http_app,
  },
  async run(event) {
    const summary = `${event.method} ${event.path}`

    this.http.respond({
      status: this.resStatusCode,
      body: this.resBody,
      headers: {
        "content-type": this.resContentType,
      },
    });

    if(this.emitBodyOnly) {
      this.$emit(event.body, { summary })
    } else {
      this.$emit(event, { summary })
    }
  }
}