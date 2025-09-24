import common from "../common/polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "bluesky-new-follower-on-account",
  name: "New Follower On Account",
  description: "Emit new event when someone follows the specified account. Requires the account ID as a prop to monitor followers for that account. [See the documentation](https://docs.bsky.app/docs/api/app-bsky-graph-get-followers).",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    accountId: {
      propDefinition: [
        common.props.app,
        "accountId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getDateField() {
      return "createdAt";
    },
    getResourceName() {
      return "followers";
    },
    getResourcesFn() {
      return this.app.getFollowers;
    },
    getResourcesFnArgs() {
      return {
        debug: true,
        params: {
          actor: this.accountId,
        },
      };
    },
    generateMeta(resource) {
      return {
        id: resource.did,
        summary: `New Follower ${resource.handle}`,
        ts: Date.parse(resource.createdAt),
      };
    },
  },
  sampleEmit,
};
