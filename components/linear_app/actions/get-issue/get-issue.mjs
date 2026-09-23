import linearApp from "../../linear_app.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "linear_app-get-issue",
  name: "Get Issue",
  description: "Retrieve a single Linear issue by its UUID or human-readable identifier. Provide exactly one of `issueId` (UUID) or `issueIdentifier` (e.g. `ENG-42`). Returns complete issue details: title, description, state, assignee, team, project, labels, and timestamps. Use the optional `fields` prop to narrow the response to only the keys you need (reduces context for large result sets). Example: `issueIdentifier: \"ENG-42\"` → returns `{id: \"iss_01abc\", identifier: \"ENG-42\", title: \"Fix login redirect\", state: {name: \"In Progress\"}}`. [See the documentation](https://linear.app/developers/graphql).",
  version: "0.2.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
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
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Optional list of field names to include in the returned issue object. When omitted, the full issue payload is returned. Pass a subset to reduce response size, e.g. `[\"id\", \"identifier\", \"title\", \"state\"]`.",
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
    if (!issue) {
      throw new ConfigurationError(`Issue not found: ${issueId || issueIdentifier}`);
    }
    $.export("$summary", `Found issue with ID ${issue?.id}`);

    if (this.fields?.length) {
      const shaped = {};
      for (const field of this.fields) {
        shaped[field] = issue[field];
      }
      return shaped;
    }

    return issue;
  },
};
