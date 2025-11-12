import common from "../common/base.mjs";

export default {
  ...common,
  key: "campaign_monitor-new-bounce",
  name: "New Bounce",
  description: "Emit new event when a campaign email bounces",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    campaignId: {
      propDefinition: [
        common.props.campaignMonitor,
        "campaignId",
        (c) => ({
          clientId: c.clientId,
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.campaignMonitor.listBounces;
    },
    getArgs() {
      return {
        campaignId: this.campaignId,
        params: {
          orderfield: "date",
          orderdirection: "desc",
        },
      };
    },
    generateMeta(bounce) {
      const ts = Date.parse(bounce[this.getTsField()]);
      return {
        id: `${bounce.EmailAddress}-${ts}`,
        summary: `New Bounce: ${bounce.EmailAddress}`,
        ts,
      };
    },
  },
};
