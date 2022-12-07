import utils from "../../common/utils.mjs";
import jira from "../../jira.app.mjs";

export default {
  key: "jira-update-issue",
  name: "Update Issue",
  description: "Updates an issue. A transition may be applied and issue properties updated as part of the edit, [See the docs](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-issueidorkey-put)",
  version: "0.2.3",
  type: "action",
  props: {
    jira,
    cloudId: {
      propDefinition: [
        jira,
        "cloudId"
      ]
    },
    issueIdOrKey: {
      propDefinition: [
        jira,
        "issueIdOrKey",
        (c) => ({
          cloudId: c.cloudId
        })
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
      propDefinition: [
        jira,
        "transition",
        (c) => ({
          issueIdOrKey: c.issueIdOrKey,
          cloudId: c.cloudId
        }),
      ],
    },
    fields: {
      propDefinition: [
        jira,
        "fields",
      ],
    },
    update: {
      type: "object",
      label: "Update",
      description: "A Map containing the field name and a list of operations to perform on the issue screen field. Note that fields included in here cannot be included in `fields`. (.i.e for Update {\"summary\":[{\"set\":\"Updated issue from Pipedream\"}],\"labels\":[{\"add\":\"triaged\"}]}') [see doc](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-issueidorkey-put)",
      optional: true,
    },
    historyMetadata: {
      type: "object",
      label: "History metadata",
      description: "Additional issue history details, See `HistoryMetadata` section of [doc](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-issueidorkey-put)",
      optional: true,
    },
    properties: {
      propDefinition: [
        jira,
        "properties",
      ],
      description: "Details of issue properties to be add or update, please provide an array of objects with keys and values.",
    },
    additionalProperties: {
      propDefinition: [
        jira,
        "additionalProperties",
      ],
    },
  },
  async run({ $ }) {
    const update = utils.parseObject(this.update);
    const fields = utils.parseObject(this.fields);
    const transition = {
      id: this.transition,
    };
    const historyMetadata = utils.parseObject(this.historyMetadata);
    const additionalProperties = utils.parseObject(this.additionalProperties);
    let properties;
    try {
      properties = JSON.parse(this.properties);
    } catch (err) {
      //pass
    }
    const response = await this.jira.updateIssue({
      $,
      cloudId,
      issueIdOrKey: this.issueIdOrKey,
      params: {
        notifyUsers: this.notifyUsers,
        overrideScreenSecurity: this.overrideScreenSecurity,
        overrideEditableFlag: this.overrideEditableFlag,
      },
      data: {
        fields,
        update,
        historyMetadata,
        properties,
        ...additionalProperties,
      },
      transition,
    });
    $.export("$summary", `Issue with ID(or key): ${this.issueIdOrKey} has been updated.`);
    return response;
  },
};
