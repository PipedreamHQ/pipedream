import common from "../common/common-polling.mjs";

export default {
  ...common,
  key: "github-new-repository",
  name: "New Repository",
  description: "Emit new event when a new repository is created or when the authenticated user receives access. [See the documentation](https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#list-repositories-for-the-authenticated-user)",
  version: "0.1.17",
  type: "source",
  dedupe: "unique",
  async run() {
    const repositories = await this.github.getRepos();

    repositories.map((repository) => {
      this.$emit(repository, {
        id: repository.id,
        summary: `New repository ${repository.id}`,
        ts: Date.parse(repository.created_at),
      });
    });
  },
};
