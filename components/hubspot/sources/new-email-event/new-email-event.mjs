import common from "../common.mjs";
import { monthAgo } from "../../common/utils.mjs";

export default {
  ...common,
  key: "hubspot-new-email-event",
  name: "New Email Event",
  description: "Emit new event for each new Hubspot email event.",
  version: "0.0.4",
  dedupe: "unique",
  type: "source",
  hooks: {},
  methods: {
    ...common.methods,
    generateMeta(emailEvent) {
      const {
        id,
        recipient,
        type,
        created,
      } = emailEvent;
      const ts = Date.parse(created);
      return {
        id,
        summary: `${recipient} - ${type}`,
        ts,
      };
    },
    getParams() {
      const startTimestamp = Date.parse(monthAgo());
      return {
        limit: 100,
        startTimestamp,
      };
    },
    async processResults(after, params) {
      await this.paginateUsingHasMore(
        params,
        this.hubspot.getEmailEvents.bind(this),
        "events",
      );
    },
  },
};
