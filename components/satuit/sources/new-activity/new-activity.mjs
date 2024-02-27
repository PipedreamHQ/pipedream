import satuit from "../../satuit.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "satuit-new-activity",
  name: "New Activity",
  description: "Emits an event when a new activity is created in Satuit.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    satuit,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
    activityType: {
      propDefinition: [
        satuit,
        "activityType",
      ],
    },
    activityDate: {
      propDefinition: [
        satuit,
        "activityDate",
      ],
    },
    associatedUser: {
      propDefinition: [
        satuit,
        "associatedUser",
      ],
    },
  },
  hooks: {
    async deploy() {
      // Emit at most 50 events in order of most recent to least recent
      const activities = await this.satuit.getActivities({
        limit: 50,
      });
      activities.slice(-50).forEach((activity) => {
        this.$emit(activity, {
          id: activity.id,
          summary: `New Activity: ${activity.title}`,
          ts: Date.parse(activity.created_at),
        });
      });
    },
  },
  methods: {
    ...satuit.methods,
    generateMeta(activity) {
      return {
        id: activity.id,
        summary: `New Activity: ${activity.title}`,
        ts: Date.parse(activity.created_at),
      };
    },
  },
  async run() {
    const lastActivityId = this.db.get("lastActivityId") || 0;
    let maxActivityId = lastActivityId;

    const activities = await this.satuit.getActivities({
      since_id: lastActivityId,
    });
    activities.forEach((activity) => {
      const meta = this.generateMeta(activity);
      this.$emit(activity, meta);
      if (activity.id > maxActivityId) {
        maxActivityId = activity.id;
      }
    });

    this.db.set("lastActivityId", maxActivityId);
  },
};
