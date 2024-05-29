import { v4 as uuidv4 } from "uuid";
import { EVENT_OPTIONS } from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import hippoVideo from "../../hippo_video.app.mjs";

export default {
  key: "hippo_video-new-triggered-event-instant",
  name: "New Event Triggered (Instant)",
  description: "Emit new event when any of the selected events are triggered.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    hippoVideo,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    alert: {
      type: "alert",
      alertType: "warning",
      content: "Please note that you can have only one webhook in your Hippo Video account, any change here will overwrite the current webhook configuration.",
    },
    eventIds: {
      type: "string[]",
      label: "Event Ids",
      description: "The Id of the events you want to be triggered.",
      options: EVENT_OPTIONS,
    },
  },
  methods: {
    removeHook() {
      this.hippoVideo.updateWebhook({
        data: {
          url: this.http.endpoint,
          secret_key: uuidv4(),
        },
      });
    },
  },
  hooks: {
    async activate() {
      await this.removeHook();
      await this.hippoVideo.updateWebhook({
        data: {
          events: parseObject(this.eventIds),
          url: this.http.endpoint,
          secret_key: uuidv4(),
        },
      });
    },
    async deactivate() {
      await this.removeHook();
    },
  },
  async run(event) {
    const { body } = event;
    const ts = Date.parse(body.eventTimestamp || new Date());

    this.$emit(body, {
      id: body.hook?.uuid || body.video_token,
      summary: `New event with event name: ${body.eventName || body.type} successfully triggered!`,
      ts: ts,
    });
  },
};
