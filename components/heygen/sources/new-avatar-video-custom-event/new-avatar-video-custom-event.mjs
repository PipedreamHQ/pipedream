import common from "../common/base.mjs";

export default {
  ...common,
  key: "heygen-new-avatar-video-custom-event",
  name: "New Avatar Video Custom Event (Instant)",
  description: "Emit new event when a specific avatar video event occurs. The user can define a custom set of event(s) to trigger. [See the documentation](https://docs.heygen.com/reference/add-a-webhook-endpoint)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    customEvents: {
      propDefinition: [
        common.props.heygen,
        "customEvents",
      ],
    },
  },
  methods: {
    ...common.methods,
    getEvents() {
      return this.customEvents;
    },
    generateMeta(body) {
      return {
        id: `${body.event_data.video_id}${body.event_type}`,
        summary: `New event ${body.event_type}`,
        ts: Date.now(),
      };
    },
  },
};
