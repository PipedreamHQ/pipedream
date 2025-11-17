import createIssue from "../create-issue/create-issue.mjs";

const {
  props: {
    github, repoFullname, ...props
  }, additionalProps, methods,
} = createIssue;

export default {
  key: "github-update-issue",
  name: "Update Issue",
  description: "Update a new issue in a GitHub repo. [See the documentation](https://docs.github.com/en/rest/issues/issues#update-an-issue)",
  version: "0.2.6",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    github,
    repoFullname,
    issueNumber: {
      label: "Issue Number",
      description: "The number that identifies the issue.",
      type: "integer",
      propDefinition: [
        github,
        "issueNumber",
        (c) => ({
          repoFullname: c.repoFullname,
        }),
      ],
    },
    ...props,
  },
  additionalProps,
  methods,
  async run({ $ }) {
    const { // eslint-disable-next-line no-unused-vars
      github, repoFullname, issueNumber, infoBox, ...data
    } = this;
    const response = await this.github.updateIssue({
      repoFullname,
      issueNumber,
      data,
    });

    $.export("$summary", `Successfully updated issue #${issueNumber}`);

    return response;
  },
};
