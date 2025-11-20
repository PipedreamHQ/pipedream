import common from "../common/common-polling.mjs";

export default {
  ...common,
  key: "github-new-repository",
  name: "New Repository",
  description: "Emit new event when a new repository is created or when the authenticated user receives access. [See the documentation](https://docs.github.com/en/rest/repos/repos?apiVersion=20.2.61-28#list-repositories-for-the-authenticated-user)",
  version: "0.2.6",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getItems() {
      return this.github.getRepos();
    },
    getItemMetadata(item) {
      return {
        summary: `New repository: "${item.full_name}"`,
        ts: Date.now(),
      };
    },
  },
};
