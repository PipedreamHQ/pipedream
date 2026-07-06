import app from "../../jira_service_desk.app.mjs";

export default {
  key: "jira_service_desk-update-issue-fields",
  name: "Update Issue Fields",
  description:
    "Updates fields on an existing Jira Service Desk request via the Jira platform API."
    + " Use this to change the summary, priority, description, or other fields after a request has been created."
    + " Use **List Sites** first to obtain the required `cloudId`."
    + " Use **List My Requests** or **Get Request** to find the `issueKey` (e.g. `IT-42`)."
    + " `fields` is a JSON object of field name-value pairs."
    + " Example: `{\"summary\": \"Updated title\", \"priority\": {\"name\": \"High\"}}`."
    + " [See the documentation](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-issueidorkey-put)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    cloudId: {
      propDefinition: [
        app,
        "cloudId",
      ],
    },
    issueIdOrKey: {
      propDefinition: [
        app,
        "issueIdOrKey",
      ],
    },
    fields: {
      type: "string",
      label: "Fields",
      description: "JSON object of Jira field name-value pairs to update."
        + " Example: `{\"summary\": \"New title\", \"priority\": {\"name\": \"High\"}}`."
        + " Use **Get Request** to see current field values.",
    },
  },
  async run({ $ }) {
    const fields = JSON.parse(this.fields);
    if (fields === null || typeof fields !== "object" || Array.isArray(fields)) {
      throw new Error("`fields` must be a JSON object (e.g. `{\"summary\": \"New title\"}`), not an array or primitive.");
    }

    await this.app.updateIssueFields({
      $,
      cloudId: this.cloudId,
      issueIdOrKey: this.issueIdOrKey,
      data: {
        fields,
      },
    });

    $.export("$summary", `Updated fields on issue ${this.issueIdOrKey}`);
    return {
      issueIdOrKey: this.issueIdOrKey,
      updatedFields: Object.keys(fields),
    };
  },
};
