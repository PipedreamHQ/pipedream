import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "storeganise-new-user-created",
  name: "New User Created",
  description: "Emit new event when a new user is created in Storeganise",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.storeganise.listUsers;
    },
    getParams(lastCreated) {
      return {
        include: [
          "customFields",
          "valetOrders",
          "items",
          "units",
          "billing",
          "settings",
          "creditsDebits",
        ],
        updatedAfter: lastCreated,
      };
    },
    generateMeta(user) {
      return {
        id: user.id,
        summary: `New User Created: ${user.id}`,
        ts: Date.parse(user.created),
      };
    },
  },
  sampleEmit,
};
