// Core HTTP component
module.exports = {
  name: "http",
  version: "0.0.1",
  props: {
    http: "$.interface.http",
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