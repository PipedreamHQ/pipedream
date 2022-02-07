import constants from "../../common/constants.mjs";
import common from "../common/base.mjs";

export default {
  ...common,
  name: "New or Updated Account",
  key: "activecampaign-new-or-updated-contact",
  description: "Emits an event each time an account is added or updated.",
  version: "0.0.7",
  props: {
    ...common.props,
    timer: {
      type: "$.interface.timer",
      label: "Polling schedule",
      description: "How often to poll the ActiveCampaign API",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },
  hooks: {
    async activate() {
      console.log("activate");
      const updatedTimestamp = this.getLastUpdatedTimestamp();

      const accounts =
        await this.paginateResources({
          params: {
            [constants.FILTER_UPDATED_AFTER]: updatedTimestamp,
          },
        });

      const [
        { updatedTimestamp: lastUpdatedTimestamp } = {},
      ] = accounts.slice(-1);

      this.setLastUpdatedTimestamp(lastUpdatedTimestamp);

      this.processEvents(accounts);
    },
    deactivate() {
      console.log("deactivate");
      this.setLastUpdatedTimestamp(undefined);
    },
  },
  methods: {
    ...common.methods,
    setLastUpdatedTimestamp(updatedTimestamp) {
      this.db.set(constants.LAST_UPDATED_TIMESTAMP, updatedTimestamp);
    },
    getLastUpdatedTimestamp() {
      this.db.get(constants.LAST_UPDATED_TIMESTAMP);
    },
    getMeta(resource) {
      const {
        id,
        name,
        updatedTimestamp,
      } = resource;
      const summary = `Account (${id}) ${name} created/updated`;
      const ts = Date.parse(updatedTimestamp);

      return {
        id: `${id}-${ts}`,
        summary,
        ts,
      };
    },
    async paginateResources(params = {}) {
      const { accounts } =
        await this.activecampaign.listAccounts({
          params: {
            limit: 3,
            ...params,
          },
        });
      return accounts;
    },
    processEvents(resources) {
      console.log("resources", resources);
      resources.forEach((resource) => {
        this.processEvent(resource);
      });
    },
    processEvent(resource) {
      const meta = this.getMeta(resource);
      this.$emit(resource, meta);
    },
    async run() {
      console.log("run");
      const updatedTimestamp = this.getLastUpdatedTimestamp();

      const accounts =
        await this.paginateResources({
          params: {
            [constants.FILTER_UPDATED_AFTER]: updatedTimestamp,
          },
        });

      const [
        { updatedTimestamp: lastUpdatedTimestamp } = {},
      ] = accounts.slice(-1);

      this.setLastUpdatedTimestamp(lastUpdatedTimestamp);

      this.processEvents(accounts);
    },
  },
};
