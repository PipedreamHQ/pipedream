import linearApp from "../../linear_app.app.mjs";

export default {
  key: "linear_app-remove-label-from-issue",
  name: "Remove Label from Issue",
  description: "Remove a label from an issue in Linear. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Mutation?query=issueremovelabel)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: true,
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
      description: "Filter selected issues by team",
      optional: true,
    },
    issueId: {
      propDefinition: [
        linearApp,
        "issueId",
        ({ teamId }) => ({
          teamId,
        }),
      ],
      description: "The ID of the issue to remove the label from",
      optional: false,
    },
    labelId: {
      propDefinition: [
        linearApp,
        "issueLabels",
        () => ({
          byId: true,
        }),
      ],
      type: "string",
      label: "Label",
      description: "The ID of the label to remove from the issue",
      optional: false,
    },
  },
  async run({ $ }) {
    const response = await this.linearApp.removeLabelFromIssue(this.issueId, this.labelId);
    $.export("$summary", `Successfully removed label from issue ${this.issueId}`);
    return response;
  },
};
