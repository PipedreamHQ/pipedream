import logbrew from "../../logbrew.app.mjs";

export default {
  key: "logbrew-resolve-issue",
  name: "Resolve Issue",
  description: "Mark a LogBrew issue resolved. [See the documentation](https://docs.logbrew.co/reference/telemetry-api#update-one-issue)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    logbrew,
    projectId: {
      propDefinition: [
        logbrew,
        "projectId",
      ],
    },
    issueId: {
      propDefinition: [
        logbrew,
        "issueId",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const issue = await this.logbrew.updateIssue({
      $,
      issueId: this.issueId,
      data: {
        status: "resolved",
      },
    });
    $.export("$summary", `Successfully resolved issue "${issue.title}"`);
    return this.logbrew.withUrl(issue);
  },
};
