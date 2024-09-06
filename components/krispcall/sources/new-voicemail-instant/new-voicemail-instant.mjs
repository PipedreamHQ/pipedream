import { axios } from "@pipedream/platform";
import krispcall from "../../krispcall.app.mjs";

export default {
  key: "krispcall-new-voicemail-instant",
  name: "New Voicemail Instant",
  description: "Emit new event when a new voicemail is sent. [See the documentation]()",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    krispcall,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  hooks: {
    async deploy() {
      const voicemails = await this.krispcall.getVoicemails();
      voicemails.slice(-50).forEach((voicemail) => {
        this.$emit(voicemail, {
          id: voicemail.id,
          summary: `New Voicemail from ${voicemail.fromNumber}`,
          ts: new Date(voicemail.timestamp).getTime(),
        });
      });
    },
    async activate() {
      // Code to subscribe to KrispCall webhook for new voicemails
    },
    async deactivate() {
      // Code to unsubscribe from KrispCall webhook for new voicemails
    },
  },
  methods: {
    async getVoicemails() {
      return this.krispcall._makeRequest({
        path: "/voicemails",
      });
    },
  },
  async run() {
    const voicemails = await this.getVoicemails();
    voicemails.forEach((voicemail) => {
      this.$emit(voicemail, {
        id: voicemail.id,
        summary: `New Voicemail from ${voicemail.fromNumber}`,
        ts: new Date(voicemail.timestamp).getTime(),
      });
    });
  },
};
