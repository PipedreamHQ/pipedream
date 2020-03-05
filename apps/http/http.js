module.exports = {
  name: "http",
  version: "0.0.1",
  props: {
    http: "$.interface.http"
  },
  events: {
    async default(event) {
      this.http.respond({
        status: 200,
        body: event
      });
      // Emit the whole event, which contains
      // the HTTP payload, headers, and more
      this.$emit(event);
    }
  }
};
