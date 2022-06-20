import common from "../sources/common.mjs";

module.exports = {
  ...common,
  methods: {
    ...common.methods,
    async getUserId() {
      const { data: authenticatedUserData } = await this.twitch.getUsers();
      const { id } = authenticatedUserData[0];
      return id;
    },
    async getPaginatedResults(paginated) {
      const results = [];
      for await (const result of paginated) {
        results.push(result);
      }
      return results;
    },
  },
};
