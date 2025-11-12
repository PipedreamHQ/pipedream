import app from "../../cleverreach.app.mjs";
import common from "../common.mjs";

export default {
  ...common,
  key: "cleverreach-new-receiver-subscribed",
  name: "New Receiver Subscribed",
  description: "Emit new event when a new subscriber is added to a selected group. [See the documentation](https://rest.cleverreach.com/explorer/v3/#!/groups-v3/list_groups_get)",
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
      description: "The group (mailing list) to watch for new subscribers",
    },
  },
  methods: {
    ...common.methods,
    async getAndProcessData() {
      const receivers = await this.getReceivers();

      let lastId;
      const lastEmittedId = this.getSavedResource();

      for (const receiver of receivers) {
        const { id } = receiver;
        if (id === lastEmittedId) break;
        this.emitEvent(receiver, "subscriber");
        lastId = id;
      }

      if (lastId !== undefined) this.setSavedResource(lastId);
    },
  },
};
