import base from "../common/base.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...base,
  key: "regfox-registrant-applied",
  name: "New Registrant Applied",
  description: "Emit new event when a registrant applies to an event. [See docs here.](https://docs.webconnex.io/api/v2/#registration-notification)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  hooks: {
    ...base.hooks,
    async deploy() {
      let lastId;
      const allRegistrants = [];

      while (true) {
        const response = await this.regfox.listRegistrants({
          params: {
            startingAfter: lastId,
            limit: constants.MAX_LIMIT,
          },
        });

        allRegistrants.push(...response.data);
        lastId = allRegistrants[allRegistrants.length - 1]?.id;

        if (!response.hasMore) {
          break;
        }
      }

      allRegistrants
        .slice(constants.DEPLOY_LIMIT)
        .forEach((registrant) => this.emitEvent({
          event: registrant,
          id: registrant.id,
          name: registrant.orderNumber,
          ts: registrant.dateCreated,
        }));
    },
  },
  methods: {
    ...base.methods,
    eventTypes() {
      return [
        "registration",
      ];
    },
    emitEvent({
      event, id, name, ts,
    }) {
      console.log("Emitting registration event...");
      this.$emit(event, {
        id,
        summary: `New registration: ${name}`,
        ts: new Date(ts),
      });
    },
    processEvent(event) {
      this.emitEvent({
        event,
        id: event.id,
        name: event.data.orderNumber,
        ts: event.registrationTimestamp,
      });
    },
  },
};
