import common from "../common/base-polling.mjs";
import constants from "../../common/constants.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "workamajig-new-activity",
  name: "New Activity",
  description: "Emit new event when a new activity is created in Workamajig",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    mode: {
      type: "string",
      label: "Mode",
      description: "Filter activities by mode",
      options: constants.ACTIVITY_MODE,
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.workamajig.searchActivities;
    },
    getResourceType() {
      return "activity";
    },
    getParams() {
      return {
        mode: this.mode
          ? this.mode
          : "",
      };
    },
    getTsField() {
      return "activityDate";
    },
    generateMeta(activity) {
      return {
        id: activity.activityKey,
        summary: `New Activity ${activity.activityKey}`,
        ts: Date.parse(activity.activityDate),
      };
    },
  },
  sampleEmit,
};
