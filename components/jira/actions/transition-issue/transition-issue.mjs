import jira from "../../jira.app.mjs";

export default {
  key: "jira-transition-issue",
  name: "Transition Issue",
  description: "Performs an issue transition and, if the transition has a screen, updates the fields from the transition screen, [See the docs](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-issueidorkey-transitions-post)",
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
    transition: {
      type: "object",
      label: "Transition",
      description: "Details of a transition, e.g. `{\"id\": \"5\"}`",
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
      description: "List of operations to perform on issue screen fields. Note that fields included in here cannot be included in fields.",
      optional: true,
    },
    historyMetadata: {
      type: "object",
      label: "History metadata",
      description: "Additional issue history details, See `HistoryMetadata` section of [doc](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-issueidorkey-transitions-post)",
      optional: true,
    },
    properties: {
      type: "string",
      label: "Properties",
      description: "Details of issue properties to be add or update.",
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
    const transition = this.jira.parseObject(this.transition);
    const fields = this.jira.parseObject(this.fields);
    const update = this.jira.parseObject(this.update);
    const historyMetadata = this.jira.parseObject(this.historyMetadata);
    const additionalProperties = this.jira.parseObject(this.additionalProperties);
    const properties = this.properties ?
      JSON.parse(this.properties) :
      undefined;
    await this.jira.transitionIssue({
      $,
      issueIdOrKey: this.issueIdOrKey,
      data: {
        transition,
        fields,
        update,
        historyMetadata,
        properties,
        ...additionalProperties,
      },
    });
    $.export("$summary", `Transition has performed for the issue with ID(or key): ${this.issueIdOrKey}`);
  },
};
