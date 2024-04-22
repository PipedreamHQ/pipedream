import { axios } from "@pipedreamhq/platform";
import forcemanager from "../../forcemanager.app.mjs";

export default {
  key: "forcemanager-new-activity-instant",
  name: "New Activity Instant",
  description: "Emits a new event when a new activity is created",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    forcemanager: {
      type: "app",
      app: "forcemanager",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  methods: {
    _getActivityId() {
      return this.db.get("activityId") || null;
    },
    _setActivityId(id) {
      this.db.set("activityId", id);
    },
  },
  hooks: {
    async deploy() {
      const activities = await this.forcemanager.listActivities();
      if (activities.length > 0) {
        this._setActivityId(activities[0].id);
      }
    },
  },
  async run() {
    const activities = await this.forcemanager.listActivities();
    const latestActivityId = this._getActivityId();
    const newActivities = activities.filter(
      (activity) => activity.id > latestActivityId,
    );

    for (const activity of newActivities) {
      this.$emit(activity, {
        id: activity.id,
        summary: `New Activity: ${activity.title}`,
        ts: Date.parse(activity.created_at),
      });
    }

    if (newActivities.length > 0) {
      this._setActivityId(newActivities[0].id);
    }
  },
};
