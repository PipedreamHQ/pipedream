import common from "../common/common-poll.mjs";

export default {
  key: "podio-new-organization-created",
  name: "New Organization created",
  description: "Emit new events when a new organization created. [See the docs here](https://developers.podio.com/doc/organizations/get-organizations-22344)",
  version: "0.0.1",
  type: "source",
  ...common,
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.app.getOrgs;
    },
    doesResourceFnHavePaging() {
      return false;
    },
    getResourceFnArgs() {
      return {};
    },
    getSummary(item) {
      return `New organization ${item.name} (ID:${item.org_id})`;
    },
    getItemId(item) {
      return item.org_id;
    },
  },
};
