import github from "../../github.app.mjs";

export default {
  key: "github-get-commit",
  name: "Get Commit",
  description: "Get a commit in a GitHub repo. [See the documentation](https://docs.github.com/en/rest/commits/commits?apiVersion=2022-11-28#get-a-commit)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    github,
    repoFullname: {
      propDefinition: [
        github,
        "repoFullname",
      ],
    },
    commitSha: {
      propDefinition: [
        github,
        "commitSha",
        (c) => ({
          repoFullname: c.repoFullname,
        }),
      ],
    },
  },
  async run({ $ }) {
    const commit = await this.github.getCommit({
      repoFullname: this.repoFullname,
      commitRef: this.commitSha,
    });

    $.export("$summary", `Successfully retrieved commit ${this.commitSha}`);

    return commit;
  },
};
