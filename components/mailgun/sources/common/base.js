const mailgun = require("../../mailgun.app");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  props: {
    mailgun,
    domain: {
      propDefinition: [
        mailgun,
        "domain",
      ],
    },
  },
  methods: {
    generateMeta() {
      return {
        id: uuidv4(),
        summary: "New event",
        ts: Date.now(),
      };
    },
  },
  async run(event) {
    const meta = this.generateMeta(event);
    this.$emit(event, meta);
  },
};
