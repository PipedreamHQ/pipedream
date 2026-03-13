import github from "../../github.app.mjs";

export default {
  key: "github-get-issue",
  name: "Get Issue",
  description: "Get details of an issue in a GitHub repository. [See the documentation](https://docs.github.com/en/rest/issues/issues?apiVersion=2022-11-28#get-an-issue)",
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
        "repoFullname",
      ],
    },
    issueNumber: {
      propDefinition: [
        github,
        "issueNumber",
        (c) => ({
          repoFullname: c.repoFullname,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.github.getIssue({
      repoFullname: this.repoFullname,
      issueNumber: this.issueNumber,
    });

    $.export("$summary", `Successfully retrieved issue #${this.issueNumber} from ${this.repoFullname}`);

    return response;
  },
};
