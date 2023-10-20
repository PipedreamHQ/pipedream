import common from "../common/base-single.mjs";

export default {
  ...common,
  type: "source",
  name: "New Activity Status Change",
  key: "teamgate-activity-status-changed",
  description: "Emit new event when a activity status is changed. [See docs here](https://developers.teamgate.com/#5b576f18-5b18-4fb0-9cbf-8d02343420d5)",
  version: "0.0.1",
  props: {
    ...common.props,
    activityId: {
      propDefinition: [
        common.props.teamgate,
        "activityId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getSummary({ status }) {
      return `Activity status changed: ${status}`;
    },
    getFn() {
      return this.teamgate.getEvent(this.activityId);
    },
    getActualValue(item) {
      return item.status;
    },
  },
};
