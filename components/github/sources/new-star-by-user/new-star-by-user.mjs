import common from "../common/common-polling.mjs";

export default {
  ...common,
  key: "github-new-star-by-user",
  name: "New Star By User",
  description: "Emit new events when the specified user stars a repository. [See the documentation](https://docs.github.com/en/rest/activity/starring?apiVersion=2022-11-28#list-repositories-starred-by-a-user)",
  version: "0.0.11",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    user: {
      type: "string",
      label: "Username",
      description: "A GitHub username to watch for new stars. Defaults to the authenticated user if not specified.",
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    async getUserStars(user) {
      const response = await this.github._client().request(`GET /users/${user}/starred`);
      return response.data;
    },
    async getItems() {
      const user = this.user ?? (await this.github.getAuthenticatedUser()).login;
      return this.getUserStars(user);
    },
    getItemMetadata(item) {
      return {
        summary: `New star: ${item.full_name}`,
        ts: Date.now(),
      };
    },
  },
};
