import common from "../common.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "aweber-new-broadcast-event",
  name: "New Broadcast Event",
  description: "Emit new event when a selected broadcast event is created. [See the documentation](https://api.aweber.com/#tag/Broadcasts/paths/~1accounts~1%7BaccountId%7D~1lists~1%7BlistId%7D~1broadcasts/get)",
  type: "source",
  version: "0.0.2",
  dedupe: "unique",
  props: {
    ...common.props,
    listId: {
      propDefinition: [
        common.props.aweberApp,
        "listId",
        ({ accountId }) => ({
          accountId,
        }),
      ],
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the broadcast event.",
      options: [
        "draft",
        "scheduled",
        "sent",
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.aweberApp.getBroadcasts;
    },
    getResourceFnArgs(args) {
      return {
        ...args,
        accountId: this.accountId,
        listId: this.listId,
        params: {
          status: this.status,
        },
      };
    },
    getSummary(resource) {
      return `New broadcast event ${resource.subject}`;
    },
  },
  sampleEmit,
};
