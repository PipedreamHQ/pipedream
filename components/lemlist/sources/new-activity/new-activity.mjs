import common from "../common/common.mjs";

export default {
  ...common,
  type: "source",
  name: "New Activity (Instant)",
  key: "lemlist-new-activity",
  description: "Emit new event for each new activity. [See docs here](https://developer.lemlist.com/#add-a-hook)",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
  },
  methods: {
    ...common.methods,
    getDataToEmit(activity) {
      const ts = new Date().getTime();
      return {
        id: `${activity.type}-${ts}`,
        summary: `New activity ${activity.type} received`,
        ts,
      };
    },
    async loadHistoricalData() {
      const activities = await this.lemlist.getActivities({
        params: {
          campaignId: this.campaignId || null,
          limit: 25,
        },
      });

      return activities.map((activity) => ({
        main: activity,
        sub: this.getDataToEmit(activity),
      }));
    },
    async proccessEvent({ body: activity }) {
      this.$emit(activity,  this.getDataToEmit(activity));
    },
  },
};
