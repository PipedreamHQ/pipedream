import common from "../common/common-polling.mjs";

export default {
  ...common,
  key: "github-new-gist",
  name: "New Gist",
  description: "Emit new events when new gists are created by the authenticated user",
  version: "0.1.17",
  type: "source",
  dedupe: "unique",
  async run() {
    const gists = await this.github.getGists();

    gists.map((gist) => {
      this.$emit(gist, {
        id: gist.id,
        summary: `New gist ${gist.id}`,
        ts: Date.parse(gist.created_at),
      });
    });
  },
};
