import linearApp from "../../linear_app.app.mjs";

export default {
  key: "linear_app-remove-label-from-issue",
  name: "Remove Label from Issue",
  description: "Removes one label from a Linear issue and leaves its other labels in place. To replace all of an issue's labels at once, use **Update Issue** with `labelIds` instead. The label can be re-added at any time, so this operation is reversible. Use **Search Issues** to find the issue ID, and **List Labels** to find the label ID. Returns the issue's `id`, `identifier`, `title`, `url` and `state` after the change. Example: `issueId: \"7df5e7f9-a357-4539-ae94-4a004fec635f\"`, `labelId: \"ab1b2c3d-0000-0000-0000-000000000005\"` → returns `{success: true, issue: {id: \"7df5e7f9-a357-4539-ae94-4a004fec635f\", identifier: \"ENG-42\", title: \"Fix login redirect on mobile\", url: \"https://linear.app/acme/issue/ENG-42/fix-login-redirect-on-mobile\", state: {name: \"In Progress\"}}}`. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Mutation?query=issueremovelabel)",
  version: "0.0.9",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    linearApp,
    issueId: {
      propDefinition: [
        linearApp,
        "issueId",
      ],
      description: "The issue to remove the label from (a UUID, e.g. `7df5e7f9-a357-4539-ae94-4a004fec635f`). Use **Search Issues** to find issues and retrieve their IDs.",
      optional: false,
    },
    labelId: {
      propDefinition: [
        linearApp,
        "issueLabelIds",
      ],
      type: "string",
      label: "Label",
      description: "The ID of the label to remove from the issue (a UUID, e.g. `ab1b2c3d-0000-0000-0000-000000000005`). Use **List Labels** to find valid label IDs.",
      optional: false,
    },
  },
  async run({ $ }) {
    const response = await this.linearApp.removeLabelFromIssue({
      $,
      issueId: this.issueId,
      labelId: this.labelId,
    });
    const summary = response.success
      ? `Removed label from issue ${response.issue.identifier}`
      : "Failed to remove label";
    $.export("$summary", summary);

    return response;
  },
};
