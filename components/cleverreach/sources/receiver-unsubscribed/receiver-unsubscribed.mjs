import app from "../../cleverreach.app.mjs";
import common from "../common.mjs";

export default {
  ...common,
  key: "cleverreach-receiver-unsubscribed",
  name: "Receiver Unsubscribed",
  description:
    "Emit new event when a receiver unsubscribes. [See the documentation](https://rest.cleverreach.com/explorer/v3/#!/groups-v3/list_groups_get)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    groupId: {
      propDefinition: [
        app,
        "groupId",
      ],
      description: "The group (mailing list) to watch for unsubscribers",
    },
  },
  methods: {
    ...common.methods,
    async getAndProcessData() {
      const receivers = await this.getReceivers({
        pagesize: 5000,
      });

      const previousReceivers = this.getSavedResource();
      if (previousReceivers?.length) {
        const ids = receivers.map(({ id }) => id);
        previousReceivers
          .filter(({ id }) => !ids.includes(id))
          .forEach((receiver) => this.emitEvent(receiver, "unsubscriber"));
      }

      this.setSavedResource(receivers.map(({
        email, id,
      }) => ({
        email,
        id,
      })));
    },
  },
};
