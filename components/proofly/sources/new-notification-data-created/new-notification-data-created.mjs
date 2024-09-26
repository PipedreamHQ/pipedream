import common from "../common/polling.mjs";

export default {
  ...common,
  key: "proofly-new-notification-data-created",
  name: "New Notification Data Created",
  description: "Emit new event when notification data is received. [See the documentation](https://proofly.io/developers)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    campaignId: {
      propDefinition: [
        common.props.app,
        "campaignId",
      ],
    },
    notificationId: {
      propDefinition: [
        common.props.app,
        "notificationId",
        ({ campaignId }) => ({
          campaignId,
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceName() {
      return "data";
    },
    getResourcesFn() {
      return this.app.listData;
    },
    getResourcesFnArgs() {
      return {
        debug: true,
        notificationId: this.notificationId,
      };
    },
    generateMeta(resource) {
      const ts = Date.parse(resource.date);
      return {
        id: ts,
        summary: "New Notification Data",
        ts,
      };
    },
  },
};
