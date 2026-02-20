import linearApp from "../../linear_app.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "linear_app-get-issue",
  name: "Get Issue",
  description: "Retrieves a Linear issue by its ID or identifier. Returns complete issue details including title, description, state, assignee, team, project, labels, and timestamps. Uses API Key authentication. [See the documentation]](https://linear.app/developers/graphql).",
  version: "0.1.16",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    linearApp,
    issueId: {
      propDefinition: [
        linearApp,
        "issueId",
      ],
      label: "Issue ID",
      description: "The issue ID",
      optional: true,
    },
    issueIdentifier: {
      propDefinition: [
        linearApp,
        "issueIdentifier",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      linearApp,
      issueId,
      issueIdentifier,
    } = this;

    if (!issueId && !issueIdentifier) {
      throw new ConfigurationError("You must provide either an issue ID or an issue identifier");
    }

    if (issueId && issueIdentifier) {
      throw new ConfigurationError("You must provide either an issue ID or an issue identifier, not both");
    }

    const issue = await linearApp.getIssue({
      issueId: issueId || issueIdentifier,
    });
    $.export("$summary", `Found issue with ID ${issue?.id}`);
    return issue;
  },
};
