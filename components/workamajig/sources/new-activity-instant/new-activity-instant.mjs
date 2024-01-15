import { axios } from "@pipedream/platform";
import workamajig from "../../workamajig.app.mjs";

export default {
  key: "workamajig-new-activity-instant",
  name: "New Activity Instant",
  description: "Emit new event when a new activity is created in Workamajig",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    workamajig,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  methods: {
    getActivityTimestamp(activity) {
      return Date.parse(activity.created_at);
    },
    generateMeta(data) {
      const {
        id, created_at,
      } = data;
      return {
        id,
        summary: `New Activity: ${id}`,
        ts: this.getActivityTimestamp(data),
      };
    },
  },
  async run() {
    const lastActivityId = this.db.get("lastActivityId") || 0;
    const activities = await this.workamajig.getActivities();
    for (const activity of activities) {
      if (activity.id > lastActivityId) {
        this.$emit(activity, this.generateMeta(activity));
        this.db.set("lastActivityId", activity.id);
      }
    }
  },
};
