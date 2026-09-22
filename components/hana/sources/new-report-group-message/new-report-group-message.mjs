import common from "../common/base-polling.mjs";

export default {
  ...common,
  key: "hana-new-report-group-message",
  name: "New Report Group Message",
  description: "Emit new event when a new message is added to a report group. [See the documentation](https://docs.hanabot.ai/docs/tutorial-connectors/hana-api#get-report-group-messages)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    reportGroupId: {
      propDefinition: [
        common.props.hana,
        "reportGroupId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getResults() {
      return this.hana.getPaginatedResults({
        fn: this.hana.searchReportGroupMessages,
        args: {
          reportGroupId: this.reportGroupId,
        },
      });
    },
    generateMeta(message) {
      return {
        id: message._id,
        summary: `New message: ${message.description}`,
        ts: Date.parse(message.createdAt),
      };
    },
  },
};
