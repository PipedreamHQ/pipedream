import common from "../common/common-polling.mjs";

export default {
  ...common,
  key: "github-new-organization",
  name: "New Organization",
  description: "Emit new event when the authenticated user is added to a new organization. [See the documentation](https://docs.github.com/en/rest/orgs/orgs?apiVersion=20.2.61-28#list-organizations-for-the-authenticated-user)",
  version: "0.2.6",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getItems() {
      return this.github.getOrganizations();
    },
    getItemMetadata(item) {
      return {
        summary: `New organization: "${item.login}"`,
        ts: Date.now(),
      };
    },
  },
};
