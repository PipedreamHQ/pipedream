const { v4: uuidv4 } = require("uuid");

const sendgrid = require("../sendgrid.app");

module.exports = {
  props: {
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
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
      const id = uuidv4();
      const summary = 'New event';
      const { timestamp: ts } = data;
      return {
        id,
        summary,
        ts,
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
