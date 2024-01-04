import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import gleap from "../../gleap.app.mjs";

export default {
  key: "gleap-new-feedback-deleted",
  name: "New Feedback Deleted",
  description: "Emit new event when a feedback is deleted.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    gleap,
    http: "$.interface.http",
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    projectId: {
      propDefinition: [
        gleap,
        "projectId",
      ],
    },
    feedbackId: {
      propDefinition: [
        gleap,
        "feedbackId",
        ({ projectId }) => ({
          projectId,
        }),
      ],
    },
  },
  methods: {
    async startEvent() {
      try {
        await this.gleap.getFeedback({
          feedbackId: this.feedbackId,
        });
      } catch (e) {
        const ts = new Date();

        this.$emit({
          shareToken: this.feedbackId,
        }, {
          id: ts,
          summary: `Feedback with shareToken: ${this.feedbackId} was successfully deleted.`,
          ts: ts,
        });
      }

    },
  },
  async run() {
    await this.startEvent();
  },
};
