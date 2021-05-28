const httpApp = require("../../http.app");

// Core HTTP component
// Returns a 200 OK response, emits the HTTP payload as an event
module.exports = {
  key: "http-new-requests-payload-only",
  name: "New Requests (Payload Only)",
  description: "Get a URL and emit the HTTP body as an event on every request",
  version: "0.0.2",
  props: {
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    httpApp,
  },
  async run(event) {
    const { body } = event;
    this.http.respond({
      status: 200,
      body,
    });
    // Emit the HTTP payload
    this.$emit({
      body,
    });
  },
};
