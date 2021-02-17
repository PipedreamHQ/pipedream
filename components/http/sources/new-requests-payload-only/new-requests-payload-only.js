const http_app = require('../../http.app.js')

// Core HTTP component
// Returns a 200 OK response, emits the HTTP payload as an event
module.exports = {
  key: "http-new-requests-payload-only",
  name: "HTTP / Webhook Requests (Simple)",
  description: "Get a Pipedream URL to catch, inspect and emit the HTTP body on every request. Send payloads up to 512k or add `pipedream_upload_body=1` as a query parameter to send payloads up to 5 terabytes).",
  version: "0.0.3",
  props: {
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    silentMode: {
      type: "boolean",
      label: "Return Empty Response",
      description: "Set to `true` to return an empty response (HTTP `204 No Content`).",
      default: false,
      optional: true,
    },
    filterFaviconRequests: {
      type: "boolean",
      label: "Exclude Favicon Requests",
      description: "Modern browsers make a request for `/favicon.ico` when a URL is loaded in the address bar. This source filters these requests out by default. Select `FALSE` to emit all requests received by this source, including those for `/favicon.ico`.",
      optional: true,
      default: true,
    },
    http_app,
  },
  async run(event) {
    // return to end execution on requests for favicon.ico
    if (this.filterFaviconRequests && event.path === '/favicon.ico')  return

    const { body } = event;

    console.log(event)
    
    if(this.silentMode) {
      this.http.respond({
        status: 204,
      });
    } else {
      this.http.respond({
        status: 200,
        body: { success: true }
      });
    }

    // Emit the HTTP payload
    this.$emit(body,{
      summary: `${event.method.toUpperCase()} ${event.path}`,
    });
  }
};