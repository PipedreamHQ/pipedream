import github from "../../github.app.mjs";

export default {
  key: "github-create-branch",
  name: "Create Branch",
  description: "Create a new branch in a repository, pointing at the tip of a source branch. Provide the repository as an `owner/repo` string, the new `branchName`, and optionally the `sourceBranch` to branch from (defaults to the repository's default branch). Use **Create or Update File Contents** to add commits to the new branch, then **Create Pull Request** to open a PR. [See the documentation](https://docs.github.com/en/rest/git/refs#create-a-reference)",
  version: "1.0.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    github,
    repoFullname: {
      propDefinition: [
        github,
        "repoFullnameStatic",
      ],
    },
    branchName: {
      label: "Branch Name",
      description: "The name of the new branch to create, e.g. `feature/new-paddock`.",
      type: "string",
    },
    sourceBranch: {
      label: "Source Branch",
      description: "The existing branch to create the new branch from. Defaults to the repository's default branch (usually `main` or `master`).",
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {
    const repoFullname = await this.github._resolveRepoFullname(this.repoFullname);

    const sourceBranch = this.sourceBranch
      ?? (await this.github.getRepo({
        repoFullname,
      })).default_branch;

    const ref = await this.github.getRef({
      repoFullname,
      ref: `heads/${sourceBranch}`,
    });

    const response = await this.github.createBranch({
      repoFullname,
      data: {
        ref: `refs/heads/${this.branchName}`,
        sha: ref.object.sha,
      },
    });

    $.export("$summary", `Successfully created branch \`${this.branchName}\` from \`${sourceBranch}\``);

    return response;
  },
};
