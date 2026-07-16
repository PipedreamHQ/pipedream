import github from "../../github.app.mjs";

export default {
  key: "github-list-milestones",
  name: "List Milestones",
  description: "List the milestones in a repository (title, state, due date, and open/closed issue counts). Use this to discover a milestone's title or number before filtering or updating issues. Provide the repository as an `owner/repo` string; if you pass only a repo name, the authenticated user is assumed as the owner. Discover repository names with **List Repositories**. [See the documentation](https://docs.github.com/en/rest/issues/milestones#list-milestones)",
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
    state: {
      type: "string",
      label: "State",
      description: "Filter milestones by state. Defaults to `open`.",
      options: [
        "open",
        "closed",
        "all",
      ],
      default: "open",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of milestones to return. Defaults: `100`",
      default: 100,
      optional: true,
    },
  },
  async run({ $ }) {
    const repoFullname = await this.github._resolveRepoFullname(this.repoFullname);

    const milestones = await this.github.getRepositoryMilestones({
      repoFullname,
      state: this.state,
      maxResults: this.maxResults,
    });

    $.export("$summary", `Found ${milestones.length} ${this.state} milestone(s) in ${repoFullname}`);

    return milestones;
  },
};
