const common = require("../common-polling.js");

module.exports = {
  ...common,
  key: "github-new-gist",
  name: "New Gist",
  description: "Emit new events when new gists are created by the authenticated user",
  version: "0.0.3",
  type: "source",
  dedupe: "last",
  methods: {
    generateMeta(data) {
      const ts = new Date(data.created_at).getTime();
      return {
        id: data.id,
        summary: `New Gist #${data.id}`,
        ts,
      };
    },
  },
  async run() {
    const since = this.db.get("since");

    const gists = await this.github.getGists({
      since,
    });

    let maxDate = since;
    for (const gist of gists) {
      if (!maxDate || new Date(gist.created_at) > new Date(maxDate)) {
        maxDate = gist.created_at;
      }
      const meta = this.generateMeta(gist);
      this.$emit(gist, meta);
    }

    if (maxDate !== since) {
      this.db.set("since", maxDate);
    }
  },
};
