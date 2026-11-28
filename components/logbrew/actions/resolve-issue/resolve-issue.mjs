import logbrew from "../../logbrew.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "logbrew-resolve-issue",
  name: "Resolve Issue",
  description: "Mark a LogBrew issue resolved and return the updated issue with its dashboard link. Use **List Issues** to find the issue ID. [See the documentation](https://docs.logbrew.co/reference/telemetry-api#update-one-issue)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
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
    return utils.withIssueUrl(issue, this.logbrew.getDashboardUrl());
  },
};
