import http from "../../http.app.mjs";

// Core HTTP component
// Returns a 200 OK response, emits the HTTP payload as an event
export default {
  key: "http-new-requests-payload-only",
  name: "New Requests (Payload Only)",
  // eslint-disable-next-line
  description: "Get a URL and emit the HTTP body as an event on every request",
  version: "0.1.2",
  type: "source",
  props: {
    // eslint-disable-next-line
    httpInterface: {
      type: "$.interface.http",
      customResponse: true,
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
    const { body } = event;
    this.httpInterface.respond({
      status: 200,
      body,
    });
    // Emit the HTTP payload
    if (this.summary) {
      this.$emit({
        body,
      }, {
        summary: this.http.interpolateSummary(this.summary, event),
      });
    } else {
      this.$emit({
        body,
      });
    }
  },
};
