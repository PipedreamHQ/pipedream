// Example component showing how to return a custom HTTP response
module.exports = {
  name: "http-custom-response",
  version: "0.0.2",
  props: {
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  async run(event) {
    this.http.respond({
      status: 200,
      headers: {
        "X-My-Custom-Header": "test"
      },
      body: event // This can be any string, object, or Buffer
    });
    // Emit the whole event, which contains
    // the HTTP payload, headers, and more
    this.$emit(event);
  }
};
