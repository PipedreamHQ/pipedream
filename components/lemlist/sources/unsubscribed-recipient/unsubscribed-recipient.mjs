import common from "../common/common.mjs";

export default {
  ...common,
  type: "source",
  name: "New Unsubscribed Recipient (Instant)",
  key: "lemlist-unsubscribe-recipient",
  description: "Emit new event when a recipient unsubscribes. [See docs here](https://developer.lemlist.com/#add-a-hook)",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
  },
  methods: {
    ...common.methods,
    getWebhookEventTypes() {
      return "emailsUnsubscribed";
    },
    getDataToEmit(activity) {
      const ts = new Date().getTime();
      return {
        id: `${activity.type}-${ts}`,
        summary: `New unsubscribed recipient - ${activity.email}`,
        ts,
      };
    },
    async loadHistoricalData() {
      const activities = await this.lemlist.getActivities({
        params: {
          campaignId: this.campaignId || null,
          limit: 25,
          type: this.getWebhookEventTypes(),
        },
      });

      return activities.map((activity) => ({
        main: activity,
        sub: this.getDataToEmit(activity),
      }));
    },
    async proccessEvent({ body: activity }) {
      this.$emit(activity, this.getDataToEmit(activity));
    },
  },
};
