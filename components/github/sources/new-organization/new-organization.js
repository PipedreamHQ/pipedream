const common = require("../common-polling.js");

module.exports = {
  ...common,
  key: "github-new-organization",
  name: "New Organization",
  description:
    "Emit new events when the authenticated user is added to a new organization",
  version: "0.0.3",
  type: "source",
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
  async run() {
    const orgs = await this.github.getOrgs();

    orgs.forEach((org) => {
      const meta = this.generateMeta(org);
      this.$emit(org, meta);
    });
  },
};
