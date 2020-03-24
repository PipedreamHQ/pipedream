// Example component that uses a prop (secret)
const get = require("lodash.get");

module.exports = {
  name: "http-require-secret",
  version: "0.0.1",
  props: {
    http: "$.interface.http",
    secret: "string"
  },
  async run(event) {
    const { headers } = event;
    const secret = get(headers, "secret");
    if (secret !== this.secret) {
      this.http.respond({
        status: 400
      });
    }
    this.http.respond({
      status: 200,
      body: event
    });
    // Emit the whole event, which contains
    // the HTTP payload, headers, and more
    this.$emit(event);
  }
};
