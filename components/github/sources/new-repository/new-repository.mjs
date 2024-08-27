import common from "../common/common-polling.mjs";

export default {
  ...common,
  key: "github-new-repository",
  name: "New Repository",
  description: "Emit new events when new repositories are created",
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
