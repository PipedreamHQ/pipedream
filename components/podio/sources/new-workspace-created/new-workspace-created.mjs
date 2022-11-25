import common from "../common/common-poll.mjs";

export default {
  key: "podio-new-workspace-created",
  name: "New Workspace created",
  description: "Emit new events when a new workspace created. [See the docs here](https://developers.podio.com/doc/spaces/get-list-of-organization-workspaces-238875316)",
  version: "0.0.1",
  type: "source",
  ...common,
  props: {
    ...common.props,
    orgId: {
      propDefinition: [
        common.props.app,
        "orgId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.app.getSpaces;
    },
    doesResourceFnHavePaging() {
      return false;
    },
    getResourceFnArgs() {
      return {
        orgId: this.orgId,
      };
    },
    getSummary(item) {
      return `New workspace ${item.name} (ID:${item.space_id})`;
    },
    getItemId(item) {
      return item.space_id;
    },
  },
};
