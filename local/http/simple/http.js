const hello = require("./hello.app.js")
const test = require("./test.app.js")
// Core HTTP component
console.log(hello)
module.exports = {
  name: "http",
  version: "0.0.1",
  props: {
    http: "$.interface.http",
  },
  async run(event) {
    const summary = `${event.method} ${event.path}`
    const h = {...hello, a: 12}
    this.http.respond({
      status: 200,
      body: h,
      headers: {
        "content-type": "application/json",
      },
    });
    this.$emit(event)
  }
}
