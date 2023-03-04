import constants from "../../common/constants.mjs";
import common from "../common/polling.mjs";

export default {
  ...common,
  key: "parseur-new-mailbox-created",
  name: "New Mailbox Created",
  description: "Emit new event when a new mailbox is created. [See the docs](https://help.parseur.com/en/articles/3566155-send-parsed-data-using-webhooks).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.app.listMailboxes;
    },
    getResourceFnArgs() {
      return {
        params: {
          page_size: constants.DEFAULT_LIMIT,
        },
      };
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Mailbox ${resource.id}`,
        ts: Date.parse(resource.last_activity),
      };
    },
  },
};
