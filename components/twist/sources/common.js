const twist = require("../twist.app.js");

module.exports = {
  dedupe: "unique",
  props: {
    twist,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    workspace: {
      propDefinition: [twist, "workspace"],
    },
  },
  hooks: {
    async activate() {
      const data = this.getHookActivationData();
      await this.twist.createHook(data);
    },
    async deactivate() {
      await this.twist.deleteHook(this.http.endpoint);
    },
  },
  async run(event) {
    const { body } = event;
    if (!body) return;

    this.http.respond({
      status: 200,
    });

    const meta = this.getMeta(body);

    this.$emit(body, meta);
  },
};