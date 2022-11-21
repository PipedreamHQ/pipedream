const common = require("./base.js");
const get = require("lodash/get");

module.exports = {
  ...common,
  props: {
    ...common.props,
    http: "$.interface.http",
  },
  hooks: {
    ...common.hooks,
    async activate() {
      const data = {
        actions: this.getActions(),
        endpoint_url: this.http.endpoint,
      };
      const { id } = await this.eventbrite.createHook(this.organization, data);
      this._setHookId(id);
    },
    async deactivate() {
      const id = this._getHookId("hookId");
      await this.eventbrite.deleteHook(id);
    },
  },
  methods: {
    ...common.methods,
    getData() {
      throw new Error("getData is not implemented");
    },
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
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
