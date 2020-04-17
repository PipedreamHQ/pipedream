// Core HTTP component
module.exports = {
  name: "http",
  version: "0.0.1",
  props: {
    http: "$.interface.http",
    eventShape: {
      type: "string", 
      label: "Event Shape",
      description: "Emit the full HTTP request (including header, body, and query) or just the HTTP body.",
      optional: true,
      options: ['Full HTTP Request', 'HTTP Body Only'],
      default: 'Full HTTP Request',
    },
    httpStatusCode: {
      type: "string", 
      label: "HTTP Status Code",
      description: "The status code to return in the HTTP response.",
      optional: true,
      default: '200',
    },
    httpResponseBody: {
      type: "string", 
      label: "HTTP Response Body",
      description: "The body to return in the HTTP response.",
      optional: true,
      default: `{ success: true }`,
    },
  },
  async run(event) {
    const summary = `${event.method} ${event.path}`

    this.http.respond({
      status: this.httpStatusCode,
      body: this.httpResponseBody,
    });

    if(this.eventShape === 'HTTP Body Only') {
      this.$emit(event.body, { summary })
    } else {
      this.$emit(event, { summary })
    }
  }
}