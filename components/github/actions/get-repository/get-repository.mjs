import github from "../../github.app.mjs";

export default {
  key: "github-get-repository",
  name: "Get Repository Info",
  description: "Get metadata for a single repository: description, default branch, visibility, topics, star/fork/open-issue counts, your permission level, and timestamps. Use this to discover a repo's default branch before reading files with **Get Repository Content** or listing history with **List Commits**. Provide the repository as an `owner/repo` string (e.g. `PipedreamHQ/pipedream`). [See the documentation](https://docs.github.com/en/rest/repos/repos#get-a-repository)",
  version: "0.1.1",
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
  },
  async run({ $ }) {
    const repoFullname = await this.github._resolveRepoFullname(this.repoFullname);
    const response = await this.github.getRepo({
      repoFullname,
    });

    $.export("$summary", `Successfully retrieved repository ${repoFullname}`);

    return response;
  },
};
