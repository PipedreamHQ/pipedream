import { axios } from "@pipedream/platform";
import howuku from "../../howuku.app.mjs";

export default {
  key: "howuku-new-incoming-feedback",
  name: "New Incoming Feedback",
  description: "Emits a new event when a new incoming feedback is received in Howuku",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    howuku,
    eventToTrack: {
      propDefinition: [
        howuku,
        "eventToTrack",
      ],
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  methods: {
    _getEventToTrack() {
      return this.db.get("eventToTrack");
    },
    _setEventToTrack(eventToTrack) {
      this.db.set("eventToTrack", eventToTrack);
    },
    generateMeta(data) {
      const {
        id, created_at,
      } = data;
      const ts = Date.parse(created_at);
      return {
        id,
        summary: `New feedback: ${id}`,
        ts,
      };
    },
  },
  hooks: {
    async deploy() {
      let eventToTrack = this._getEventToTrack();
      if (!eventToTrack) {
        eventToTrack = await this.howuku.emitEvent(this.eventToTrack, {});
        this._setEventToTrack(eventToTrack);
      }
      this.$emit(eventToTrack, {
        id: eventToTrack._id,
        summary: `New Incoming Feedback: ${eventToTrack.event}`,
        ts: Date.parse(eventToTrack.created_at),
      });
    },
  },
  async run() {
    const eventToTrack = this._getEventToTrack();
    const { data } = await this.howuku.emitEvent(this.eventToTrack, {});
    if (data._id !== eventToTrack._id) {
      this._setEventToTrack(data);
      this.$emit(data, this.generateMeta(data));
    }
  },
};
