import dropmark from "../../dropmark.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "dropmark-new-activity",
  name: "New Activity",
  description: "Emit new event when a new activity occurs. [See the documentation](https://support.dropmark.com/article/96-api)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    dropmark,
    username: {
      propDefinition: [
        dropmark,
        "username",
      ],
    },
    personalKey: {
      propDefinition: [
        dropmark,
        "personalKey",
      ],
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
  },
  methods: {
    _getActivityId(activity) {
      // Use a unique property from the activity to generate an ID
      return activity.id;
    },
    _getActivityTimestamp(activity) {
      // Convert the activity's timestamp to a Unix timestamp (seconds)
      return +new Date(activity.created_at) / 1000;
    },
  },
  async run() {
    // Get the last activity ID from the DB, or set it to null
    let lastActivityId = this.db.get("lastActivityId") || null;

    // Get the latest activities
    const activities = await this.dropmark.checkNewActivity({
      username: this.username,
      personalKey: this.personalKey,
    });

    // Loop over each activity, newest to oldest
    for (const activity of activities.reverse()) {
      const activityId = this._getActivityId(activity);

      // If this is the first run, or this is a new activity
      if (!lastActivityId || activityId > lastActivityId) {
        // Emit the activity as an event
        this.$emit(activity, {
          id: activityId,
          summary: `New activity: ${activity.title}`,
          ts: this._getActivityTimestamp(activity),
        });

        // Update the last activity ID
        lastActivityId = activityId;
      }
    }

    // Store the last activity ID in the DB
    this.db.set("lastActivityId", lastActivityId);
  },
};
