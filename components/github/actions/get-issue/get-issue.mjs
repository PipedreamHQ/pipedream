import github from "../../github.app.mjs";

export default {
  key: "github-get-issue",
  name: "Get Issue",
  description: "Get the full details of a single issue: title, body, state, labels, assignees, milestone, comment count, and timestamps. Provide the repository as an `owner/repo` string and the issue number. If you only know the issue by title or topic, call **Search Issues and Pull Requests** first to resolve its number. [See the documentation](https://docs.github.com/en/rest/issues/issues?apiVersion=2022-11-28#get-an-issue)",
  version: "0.1.0",
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
    issueNumber: {
      propDefinition: [
        github,
        "issueNumberStatic",
      ],
    },
  },
  async run({ $ }) {
    const repoFullname = await this.github._resolveRepoFullname(this.repoFullname);
    const response = await this.github.getIssue({
      repoFullname,
      issueNumber: this.issueNumber,
    });

    $.export("$summary", `Successfully retrieved issue #${this.issueNumber} from ${repoFullname}`);

    return response;
  },
};
