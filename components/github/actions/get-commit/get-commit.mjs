import github from "../../github.app.mjs";

export default {
  key: "github-get-commit",
  name: "Get Commit",
  description: "Get the details of a single commit, including the list of files it changed (with per-file additions/deletions and patches) and aggregate stats. Provide the repository as an `owner/repo` string and a `ref` — a commit SHA, branch name, or tag. Use **List Commits** to find a commit SHA, or pass a branch name like `main` to get its latest commit. [See the documentation](https://docs.github.com/en/rest/commits/commits#get-a-commit)",
  version: "1.0.0",
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
        "repoFullnameStatic",
      ],
    },
    ref: {
      type: "string",
      label: "Ref",
      description: "The commit to retrieve: a commit SHA, branch name (e.g. `main`), or tag.",
    },
  },
  async run({ $ }) {
    const repoFullname = await this.github._resolveRepoFullname(this.repoFullname);
    const commit = await this.github.getCommit({
      repoFullname,
      commitRef: this.ref,
    });

    $.export("$summary", `Successfully retrieved commit ${commit.sha?.slice(0, 7) ?? this.ref}`);

    return commit;
  },
};
