import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import constants from "../../common/constants.mjs";
import common from "../common/base.mjs";

export default {
  ...common,
  name: "New or Updated Account",
  key: "activecampaign-new-or-updated-account",
  description: "Emit new event each time an account is added or updated.",
  version: "0.0.6",
  type: "source",
  dedupe: "greatest",
  props: {
    ...common.props,
    timer: {
      type: "$.interface.timer",
      label: "Polling schedule",
      description: "How often to poll the ActiveCampaign API",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    ...common.methods,
    getUpdatedTimestampPropertyName() {
      return "updatedTimestamp";
    },
    getCreatedTimestampPropertyName() {
      return "createdTimestamp";
    },
    getMeta(resource) {
      const createdTimestamoProp = this.getCreatedTimestampPropertyName();
      const updatedTimestamoProp = this.getUpdatedTimestampPropertyName();
      const {
        id,
        name,
        [createdTimestamoProp]: createdTimestamp,
        [updatedTimestamoProp]: updatedTimestamp,
      } = resource;
      const ts = Date.parse(updatedTimestamp);
      const creationTs = Date.parse(createdTimestamp);
      const summary = `Account ID: (${id}) ${name} ${ts === creationTs && "created" || "updated"}`;
      return {
        id: ts,
        summary,
        ts,
      };
    },
    async listResources() {
      const { accounts: resources } =
        await this.activecampaign.listAccounts({
          params: {
            limit: constants.DEFAULT_LIMIT,
          },
        });
      return resources;
    },
  },
};
