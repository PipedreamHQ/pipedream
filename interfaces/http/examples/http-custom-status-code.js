// Example component showing how to return a custom status code
module.exports = {
  name: "http-custom-status-code",
  version: "0.0.2",
  props: {
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    status: "string",
  },
  async run(event) {
    this.http.respond({
      status: this.status,
    });
    // Emit the status and the HTTP event, which contains
    // the HTTP payload, headers, and more
    this.$emit({
      status: this.status,
      event,
    });
  },
};
