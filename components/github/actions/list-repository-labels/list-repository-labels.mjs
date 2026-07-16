import github from "../../github.app.mjs";

export default {
  key: "github-list-repository-labels",
  name: "List Repository Labels",
  description: "List the labels defined in a repository (name, color, and description). Use this to discover valid label names before filtering issues or applying labels. Provide the repository as an `owner/repo` string; if you pass only a repo name, the authenticated user is assumed as the owner. Discover repository names with **List Repositories**. [See the documentation](https://docs.github.com/en/rest/issues/labels#list-labels-for-a-repository)",
  version: "0.0.1",
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
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of labels to return. Defaults: `100`",
      default: 100,
      optional: true,
    },
  },
  async run({ $ }) {
    const repoFullname = await this.github._resolveRepoFullname(this.repoFullname);

    let labels = await this.github.getRepositoryLabels({
      repoFullname,
    });

    labels = labels.slice(0, this.maxResults);

    $.export("$summary", `Found ${labels.length} label(s) in ${repoFullname}`);

    return labels;
  },
};
