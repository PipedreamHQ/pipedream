import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import app from "../../rumi_ai.app.mjs";

export default {
  key: "rumi_ai-new-session-completed",
  name: "New Session Completed",
  description: "Emit new events when a session is completed. [See the documentation](https://rumiai.notion.site/Rumi-Public-API-Authentication-02055b7286874bd7b355862f1abe48d9)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  async run({ $ }) {
    const { app } = this;

    const response = await app.getPastSessions({
      $,
      debug: true,
    });

    const sessions = response?.data?.sessions || [];

    sessions.forEach((session) => {
      this.$emit(session, {
        id: session.sessionID,
        summary: `New Session Completed ${session.sessionTitle || "Untitled"}`,
        ts: session.createTimestamp,
      });
    });
  },
};
