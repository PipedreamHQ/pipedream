// Core HTTP component
// Returns a 200 OK response, emits the HTTP payload as an event
module.exports = {
  name: "http-payload-only",
  version: "0.0.1",
  props: {
    http_webhook: {
      type: 'app',
      app: 'http_webhook',
    },
    http: "$.interface.http"
  },
  async run(event) {
    const { body } = event;
    this.http.respond({
      status: 200,
      body
    });
    // Emit the HTTP payload
    this.$emit({ body });
  }
};
