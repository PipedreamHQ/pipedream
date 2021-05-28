const { v4: uuidv4 } = require("uuid");

const sendgrid = require("../../sendgrid.app");

module.exports = {
  props: {
    db: "$.service.db",
    sendgrid,
  },
  methods: {
    slugifyEmail(email) {
      return email
        .replace(/[@]/g, '-at-')
        .replace(/[\.]/g, '-');
    },
    toISOString(timestamp) {
      const date = new Date(timestamp);
      return date.toISOString();
    },
    generateMeta(data) {
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
