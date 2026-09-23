import linearApp from "../../linear_app.app.mjs";

export default {
  key: "linear_app-remove-label-from-issue",
  name: "Remove Label from Issue",
  description: "Remove a label from an issue in Linear. The label can be re-added at any time, so this operation is reversible. Use **Search Issues** to find the issue ID, and **List Labels** to find the label ID. Example: `issueId: \"iss_01abc\"`, `labelId: \"lbl_bug123\"` → removes the label and returns `{success: true}`. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Mutation?query=issueremovelabel)",
  version: "0.0.5",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    linearApp,
    teamId: {
      propDefinition: [
        linearApp,
        "teamId",
      ],
      description: "Filter selected issues by team. Use **Get Teams** to discover valid team IDs.",
      optional: true,
    },
    issueId: {
      propDefinition: [
        linearApp,
        "issueId",
      ],
      description: "The ID of the issue to remove the label from",
      optional: false,
    },
    labelId: {
      propDefinition: [
        linearApp,
        "issueLabelIds",
      ],
      type: "string",
      label: "Label",
      description: "The ID of the label to remove from the issue. Use **List Labels** to find valid label IDs.",
      optional: false,
    },
  },
  async run({ $ }) {
    const response = await this.linearApp.removeLabelFromIssue(this.issueId, this.labelId);
    $.export("$summary", `Successfully removed label from issue ${this.issueId}`);
    return response;
  },
};
