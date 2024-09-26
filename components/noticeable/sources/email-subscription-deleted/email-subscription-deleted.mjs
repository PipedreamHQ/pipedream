import common from "../common/common.mjs";

export default {
  ...common,
  key: "noticeable-email-subscription-deleted",
  name: "New Email Subscription Deleted Event",
  description: "Emit new events when an email subscription is deleted. [See the docs](https://graphdoc.noticeable.io/emailsubscription.doc.html)",
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
        compare: "delete",
        itemKey: "node",
        idKey: "email",
        queryArgs: {
          projectId: this.projectId,
        },
      };
    },
    getSummary(item) {
      return `Email subscription deleted. Email(${item?.email})`;
    },
  },
};
