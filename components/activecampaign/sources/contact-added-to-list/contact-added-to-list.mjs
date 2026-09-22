import activecampaign from "../../activecampaign.app.mjs";
import constants from "../../common/constants.mjs";
import common from "../common/webhook.mjs";

export default {
  ...common,
  name: "New Contact Added to List (Instant)",
  key: "activecampaign-contact-added-to-list",
  description: "Emit new event each time a new contact is added to a list.",
  version: "0.0.8",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    lists: {
      propDefinition: [
        activecampaign,
        "lists",
      ],
    },
  },
  hooks: {
    async activate() {
      const sources =
        this.sources?.length > 0
          ? this.sources
          : constants.ALL_SOURCES;
      const hookIds = [];
      const events = this.getEvents();
      if (this.lists?.length > 0) {
        try {
          for (const list of this.lists) {
            const { webhook } = await this.activecampaign.createHook(
              events,
              this.http.endpoint,
              sources,
              list,
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
          sources,
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
      return [
        "subscribe",
      ];
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
