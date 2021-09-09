const common = require("../common-polling.js");

module.exports = {
  ...common,
  key: "github-new-team",
  name: "New Team",
  description: "Emit new events when the user is added to a new team",
  version: "0.0.3",
  type: "source",
  dedupe: "last",
  methods: {
    generateMeta(data) {
      const ts = new Date(data.created_at).getTime();
      return {
        id: data.id,
        summary: data.name,
        ts,
      };
    },
  },
  async run() {
    const teams = await this.github.getTeams();

    for (const team of teams) {
      const meta = this.generateMeta(team);
      this.$emit(team, meta);
    }
  },
};
