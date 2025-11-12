import common from "../common/base.mjs";

export default {
  ...common,
  key: "campaign_monitor-new-email-open",
  name: "New Email Open",
  description: "Emit new event when an email from a campaign is opened",
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
      return this.campaignMonitor.listOpens;
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
    generateMeta(open) {
      const ts = Date.parse(open[this.getTsField()]);
      return {
        id: `${open.EmailAddress}-${ts}`,
        summary: `New Email Open: ${open.EmailAddress}`,
        ts,
      };
    },
  },
};
