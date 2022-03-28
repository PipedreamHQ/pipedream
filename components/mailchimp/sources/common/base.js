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
    console.log("check about interval times on timer based sources of 60*15 seconds (15 minutes)");
    await this.processEvent(event);
  },
};
