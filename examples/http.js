module.exports = {
  name: "HTTP Example",
  version: "0.0.1",
  props: {
    http: "$.interface.http",
  },
  async run(event) {
    this.http.respond({
      status: 200,
      body: {
        'msg': 'hello world!'
      },
      headers: {
        "content-type": "application/json",
      },
    });
    console.log(event)
  }
}