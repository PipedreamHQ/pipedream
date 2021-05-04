const common = require("./common.js");
const get = require("lodash/get");

module.exports = {
  ...common,
  props: {
    ...common.props,
    http: "$.interface.http",
  },
  hooks: {
    async activate() {
      const data = {
        actions: this.getActions(),
        endpoint_url: this.http.endpoint,
      };
      const { id } = await this.eventbrite.createHook(this.organization, data);
      this.db.set("hookId", id);
    },
    async deactivate() {
      const id = this.db.get("hookId");
      await this.eventbrite.deleteHook(id);
    },
  },
  methods: {
    ...common.methods,
    getData() {
      throw new Error("getData is not implemented");
    },
  },
  async run(event) {
    const url = get(event, "body.api_url");
    if (!url) return;

    const resource = await this.eventbrite.getResource(url);

    const data = await this.getData(resource);

    this.emitEvent(data);
  },
};