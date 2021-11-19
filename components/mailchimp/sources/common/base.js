const { v4: uuidv4 } = require("uuid");
const mailchimp = require("../../mailchimp.app");

module.exports = {
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
    processEvent(event) {
      const meta = this.generateMeta(event);
      this.$emit(event, meta);
    },
  },
  async run(event) {
    await this.processEvent(event);
  },
};
