import common from "../common/common-polling.mjs";

export default {
  ...common,
  key: "github-new-gist",
  name: "New Gist",
  description: "Emit new events when new gists are created by the authenticated user. [See the documentatoion](https://docs.github.com/en/rest/gists/gists?apiVersion=20.2.61-28#list-gists-for-the-authenticated-user)",
  version: "0.2.6",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getItems() {
      return this.github.getGists();
    },
    getItemMetadata(item) {
      return {
        summary: `New gist: ${item.id}`,
        ts: Date.parse(item.created_at),
      };
    },
  },
};
