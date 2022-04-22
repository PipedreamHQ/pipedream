import sendgrid from "../../sendgrid.app.mjs";
import { v4 } from "uuid";
const uuidv4 = v4;

export default {
  props: {
    db: "$.service.db",
    sendgrid,
  },
  methods: {
    slugifyEmail(email) {
      return email
        .replace(/[@]/g, "-at-")
        .replace(/[.]/g, "-");
    },
    toISOString(timestamp) {
      const date = new Date(timestamp);
      return date.toISOString();
    },
    generateMeta() {
      return {
        id: uuidv4(),
        summary: "New event",
        ts: Date.now(),
      };
    },
    processEvent(event) {
      const meta = this.generateMeta(event);
      this.$emit(event, meta);
    },
  },
  async run(event) {
    await this.processEvent(event);
  },
};
