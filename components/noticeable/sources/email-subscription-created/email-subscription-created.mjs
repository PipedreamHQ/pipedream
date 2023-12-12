import common from "../common/common.mjs";

export default {
  ...common,
  key: "noticeable-email-subscription-created",
  name: "New Email Subscription Created Event",
  description: "Emit new events when a new email subscription created. [See the docs](https://graphdoc.noticeable.io/emailsubscription.doc.html)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    projectId: {
      propDefinition: [
        common.props.app,
        "projectId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getConfig() {
      return {
        queryFnName: "getEmailSubscriptionsQuery",
        resourceKey: "data.project.data.edges",
        cursorKey: "data.project.data.pageInfo.startCursor",
        compare: "create",
        itemKey: "node",
        queryArgs: {
          projectId: this.projectId,
        },
      };
    },
    getSummary(item) {
      return `New email subscription Email(${item?.email})`;
    },
  },
};
