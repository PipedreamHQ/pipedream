import heygen from "../../heygen.app.mjs";

export default {
  key: "heygen-new-avatar-video-custom-event-instant",
  name: "New Avatar Video Custom Event Instant",
  description: "Emits a new event when a specific avatar video event occurs. The user can define a custom set of event(s) to trigger. [See the documentation](https://docs.heygen.com/reference/authentication-1)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    heygen,
    customEvents: {
      propDefinition: [
        heygen,
        "customEvents",
      ],
    },
    storageKey: {
      propDefinition: [
        heygen,
        "storageKey",
      ],
    },
    templateId: {
      propDefinition: [
        heygen,
        "templateId",
      ],
    },
    videoId: {
      propDefinition: [
        heygen,
        "videoId",
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
    ...heygen.methods,
  },
  hooks: {
    async deploy() {
      this.db.set("lastEventId", 0);
    },
  },
  async run() {
    const videoLink = await this.heygen.fetchShareableLink(this.videoId);

    for (const event of this.customEvents) {
      const eventData = {
        videoLink,
        storageKey: this.storageKey,
        templateId: this.templateId,
      };
      const response = await this.heygen.emitEvent(event, eventData);
      const eventId = response.id;
      const lastEventId = this.db.get("lastEventId");
      if (eventId > lastEventId) {
        this.$emit(eventData, {
          id: eventId,
          summary: `New event ${event} triggered`,
          ts: Date.now(),
        });
        this.db.set("lastEventId", eventId);
      }
    }
  },
};
