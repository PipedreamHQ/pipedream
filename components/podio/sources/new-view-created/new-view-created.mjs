import common from "../common/common-poll.mjs";

export default {
  key: "podio-new-view-created",
  name: "New View created",
  description: "Emit new events when a new view created. [See the docs here](https://developers.podio.com/doc/views/get-views-27460)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  ...common,
  props: {
    ...common.props,
    orgId: {
      propDefinition: [
        common.props.app,
        "orgId",
      ],
    },
    spaceId: {
      propDefinition: [
        common.props.app,
        "spaceId",
        (configuredProps) => ({
          orgId: configuredProps.orgId,
        }),
      ],
    },
    appId: {
      propDefinition: [
        common.props.app,
        "appId",
        (configuredProps) => ({
          spaceId: configuredProps.spaceId,
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.app.getViews;
    },
    doesResourceFnHavePaging() {
      return false;
    },
    getResourceFnArgs() {
      return {
        appId: this.appId,
        params: {
          include_standard_views: true,
        },
      };
    },
    getSummary(item) {
      return `New view ${item.name} (ID:${item.view_id})`;
    },
    getItemId(item) {
      return item.view_id;
    },
  },
};
