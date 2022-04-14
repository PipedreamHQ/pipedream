import jira from "../../jira.app.mjs";

export default {
  key: "jira-update-issue",
  name: "Update Issue",
  description: "Updates an issue. A transition may be applied and issue properties updated as part of the edit, [See the docs](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-issueidorkey-put)",
  version: "0.1.2",
  type: "action",
  props: {
    jira,
    issueIdOrKey: {
      propDefinition: [
        jira,
        "issueIdOrKey",
      ],
    },
    notifyUsers: {
      type: "boolean",
      label: "Notify users",
      description: "Whether a notification email about the issue update is sent to all watchers. To disable the notification, administer Jira or administer project permissions are required. If the user doesn't have the necessary permission the request is ignored.",
      optional: true,
    },
    overrideScreenSecurity: {
      type: "boolean",
      label: "Override screen security",
      description: "Whether screen security should be overridden to enable hidden fields to be edited. Available to Connect app users with admin permissions.",
      optional: true,
    },
    overrideEditableFlag: {
      type: "boolean",
      label: "Override editable flag",
      description: "Whether screen security should be overridden to enable uneditable fields to be edited. Available to Connect app users with admin permissions.",
      optional: true,
    },
    transition: {
      type: "object",
      label: "Transition",
      description: "Details of a transition. Required when performing a transition, optional when creating or editing an issue, See `Transition` section of [doc](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-issueidorkey-put)",
      optional: true,
    },
    fields: {
      type: "object",
      label: "Fields",
      description: "List of issue screen fields to update, specifying the sub-field to update and its value for each field. This field provides a straightforward option when setting a sub-field. When multiple sub-fields or other operations are required, use `update`. Fields included in here cannot be included in `update`.",
      optional: true,
    },
    update: {
      type: "object",
      label: "Update",
      description: "A Map containing the field name and a list of operations to perform on the issue screen field. Note that fields included in here cannot be included in `fields`.",
      optional: true,
    },
    historyMetadata: {
      type: "object",
      label: "History metadata",
      description: "Additional issue history details, See `HistoryMetadata` section of [doc](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-issueidorkey-put)",
      optional: true,
    },
    properties: {
      type: "string",
      label: "Properties",
      description: "Details of issue properties to be add or update, please provide an array of objects with keys and values.",
      optional: true,
    },
    additionalProperties: {
      type: "object",
      label: "Additional properties",
      description: "Extra properties of any type may be provided to this object.",
      optional: true,
    },
  },
  async run({ $ }) {
    const update = this.jira.parseObject(this.update);
    const fields = this.jira.parseObject(this.fields);
    const transition = this.jira.parseObject(this.transition);
    const historyMetadata = this.jira.parseObject(this.historyMetadata);
    const additionalProperties = this.jira.parseObject(this.additionalProperties);
    const properties = this.properties ?
      JSON.parse(this.properties) :
      undefined;
    const response = await this.jira.updateIssue({
      $,
      issueIdOrKey: this.issueIdOrKey,
      params: {
        notifyUsers: this.notifyUsers,
        overrideScreenSecurity: this.overrideScreenSecurity,
        overrideEditableFlag: this.overrideEditableFlag,
      },
      data: {
        transition,
        fields,
        update,
        historyMetadata,
        properties,
        ...additionalProperties,
      },
    });
    $.export("$summary", `Issue with ID(or key): ${this.issueIdOrKey} has been updated.`);
    return response;
  },
};
