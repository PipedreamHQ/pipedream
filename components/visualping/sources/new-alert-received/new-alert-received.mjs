import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import visualping from "../../app/visualping.app.mjs";

export default {
  name: "New Alert Received",
  version: "0.0.1",
  key: "visualping-new-alert-received",
  description: "Emit new event when a change alert is sent.",
  type: "source",
  dedupe: "unique",
  props: {
    visualping,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      static: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    workspaceId: {
      propDefinition: [
        visualping,
        "workspaceId",
      ],
    },
    jobId: {
      propDefinition: [
        visualping,
        "jobId",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
    },
  },
  methods: {
    emitEvent(data) {
      this.$emit(data, {
        id: data.process_id,
        summary: `New alert sent with ID ${data.process_id}`,
        ts: Date.parse(data.process_created),
      });
    },
  },
  async run() {
    const { history: events } = await this.visualping.getJob({
      workspaceId: this.workspaceId,
      jobId: this.jobId,
    });

    events.reverse().filter((event) => event.notification_send)
      .forEach(this.emitEvent);
  },
};
