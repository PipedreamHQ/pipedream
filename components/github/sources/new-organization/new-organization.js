const common = require("../common-polling.js");

module.exports = {
  ...common,
  key: "github-new-organization",
  name: "New Organization",
  description:
    "Emit an event when the authenticated user is added to a new organization.",
  version: "0.0.1",
  dedupe: "last",
  methods: {
    generateMeta(data) {
      const ts = Date.now();
      return {
        id: data.id,
        summary: data.login,
        ts,
      };
    },
  },
  async run(event) {
    const orgs = await this.github.getOrgs();

    orgs.forEach((org) => {
      const meta = this.generateMeta(org);
      this.$emit(org, meta);
    });
  },
};