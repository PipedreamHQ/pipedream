const activecampaign = require("../../activecampaign.app.js");
const common = require("../common-webhook.js");

module.exports = {
  ...common,
  name: "New Contact Added to List",
  key: "activecampaign-contact-added-to-list",
  description: "Emits an event each time a new contact is added to a list.",
  version: "0.0.2",
  props: {
    ...common.props,
    lists: { propDefinition: [activecampaign, "lists"] },
  },
  hooks: {
    async activate() {
      const sources =
        this.sources.length > 0
          ? this.sources
          : this.activecampaign.getAllSources();
      const hookIds = [];
      const events = this.getEvents();
      if (this.lists.length > 0) {
        try {
          for (const list of this.lists) {
            const { webhook } = await this.activecampaign.createHook(
              events,
              this.http.endpoint,
              sources,
              list
            );
            hookIds.push(webhook.id);
          }
        } catch (err) {
          // if webhook creation fails, delete all hooks created so far
          for (const id of hookIds) {
            await this.activecampaign.deleteHook(id);
          }
          this.db.set("hookIds", []);
          throw new Error(err);
        }
      } 
      // if no lists specified, create a webhook to watch all lists
      else {
        const { webhook } = await this.activecampaign.createHook(
          events,
          this.http.endpoint,
          sources
        );
        hookIds.push(webhook.id);
      }
      this.db.set("hookIds", hookIds);
    },
    async deactivate() {
      const hookIds = this.db.get("hookIds");
      for (const id of hookIds) {
        await this.activecampaign.deleteHook(id);
      }
    },
  },
  methods: {
    ...common.methods,
    getEvents() {
      return ["subscribe"];
    },
    async getMeta(body) {
      const { list } = await this.activecampaign.getList(body.list);
      const { date_time: dateTimeIso } = body;
      const ts = Date.parse(dateTimeIso);
      return {
        id: `${body["contact[id]"]}${list.id}${ts}`,
        summary: `${body["contact[email]"]} added to ${list.name}`,
        ts,
      };
    },
  },
};