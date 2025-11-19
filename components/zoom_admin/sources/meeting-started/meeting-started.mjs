import { v4 as uuidv4 } from "uuid";
import zoomAdmin from "../../zoom_admin.app.mjs";

export default {
  key: "zoom_admin-meeting-started",
  type: "source",
  name: "Meeting Started",
  description: "Emits an event each time a meeting starts in your Zoom account",
  version: "0.1.9",
  dedupe: "unique", // Dedupe based on meeting ID
  props: {
    zoomAdmin,
    zoomApphook: {
      type: "$.interface.apphook",
      appProp: "zoomAdmin",
      eventNames: [
        "meeting.started",
      ],
    },
  },
  async run(event) {
    const { payload } = event;
    this.$emit(event, {
      summary: payload?.object?.topic
        ? `Meeting ${payload?.object?.topic} started`
        : "Meeting started",
      id: payload?.object?.uuid ?? uuidv4(),
      ts: payload?.object?.start_time
        ? +new Date(payload.object.start_time)
        : new Date(),
    });
  },
};
