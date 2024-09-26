import { v4 as uuidv4 } from "uuid";
import mailchimp from "../../mailchimp.app.mjs";

export default {
  props: {
    db: "$.service.db",
    mailchimp,
  },
  methods: {
    slugifyEmail(email) {
      return email
        .replace(/[@]/g, "-at-")
        .replace(/[.]/g, "-");
    },
    generateMeta() {
      return {
        id: uuidv4(),
        summary: "New event",
        ts: Date.now(),
      };
    },
    getDbServiceVariable(variable) {
      return this.db.get(`${variable}`);
    },
    processEvent(event) {
      const meta = this.generateMeta(event);
      this.$emit(event, meta);
    },
    setDbServiceVariable(variable, value) {
      this.db.set(`${variable}`, value);
    },
  },
  async run(event) {
    await this.processEvent(event);
  },
};
