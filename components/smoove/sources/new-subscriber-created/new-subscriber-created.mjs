import common from "../common/polling.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "smoove-new-subscriber-created",
  name: "New Subscriber Created",
  description: "Emit new event when a new subscriber is created. [See the docs](https://rest.smoove.io/#!/Contacts/Contacts_Get).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.app.getContacts;
    },
    getResourceFnArgs() {
      return {
        params: {
          itemsPerPage: constants.DEFAULT_LIMIT,
          sort: "-id",
        },
      };
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        ts: Date.now(),
        summary: `New Subscriber Created ${resource.id}`,
      };
    },
  },
};
