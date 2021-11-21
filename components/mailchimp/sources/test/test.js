const common = require("../common/http-based");

module.exports = {
  ...common,
  key: "mailchimp-test",
  name: "New Test",
  description: "Emmit new test  to confirm commons are loaded properly",
  version: "0.0.1",
  type: "source",
  props: {
    ...common.props,
    name: {
      type: "string",
      label: "Just enter a random string here",
      description:
        "A random string.",
    },
  },
  hooks: {
    ...common.hooks,
    async activate() {
      console.log("running [activate]");
      console.log(JSON.stringify(this.mailchimp._auths()));
      console.log(this.name);
      console.log(this.http.endpoint);
      this.http.respond({
        status: 200,
      });
    },
  },
  async run() {
    console.log("running [run]");
    console.log(this.name);
    console.log(this.http.endpoint);
    this.http.respond({
      status: 200,
    });
  },
};
