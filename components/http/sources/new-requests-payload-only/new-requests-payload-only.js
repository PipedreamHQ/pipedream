const http_app = require('../../http.app.js')

// Core HTTP component
// Returns a 200 OK response, emits the HTTP payload as an event
module.exports = {
  key: "http-new-requests-payload-only",
  name: "HTTP / Webhook Requests (Simple)",
  description: "Get a URL and emit the HTTP body as an event on every request",
  version: "0.0.2",
  props: {
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    silentMode: {
      type: "boolean",
      label: "Silent Mode",
      description: "Set to `true` to return an empty response (HTTP `204 No Content`).",
      default: false,
      optional: true,
    },
    http_app,
  },
  async run(event) {
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