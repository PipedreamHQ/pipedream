module.exports = {
  name: "http",
  version: "0.0.1",
  props: {
    http: "$.interface.http"
  },
  async run(event) {
    this.http.respond({
      status: 200,
      body: {
        success: true
      }
    });
    // Emit the whole event, which contains
    // the HTTP payload, headers, and more
    this.$emit(event);
  }
};
