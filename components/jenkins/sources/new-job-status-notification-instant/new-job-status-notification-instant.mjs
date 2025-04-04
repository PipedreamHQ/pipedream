import common from "../common/webhook.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "jenkins-new-job-status-notification-instant",
  name: "New Jenkins Job Status Notification (Instant)",
  description: "Emit new event when a Jenkins job sends a status notification via the notification plugin. [See the documentation](https://github.com/jenkinsci/notification-plugin).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventName() {
      return events.ALL.value;
    },
    generateMeta(resource) {
      const {
        timestamp: ts,
        name,
        phase,
      } = resource.build;
      return {
        id: `${name}-${ts}`,
        summary: `New Status ${phase}`,
        ts,
      };
    },
  },
};
