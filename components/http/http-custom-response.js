module.exports = {
  name: "http-custom-response",
  version: "0.0.1",
  props: {
    http: "$.interface.http"
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
