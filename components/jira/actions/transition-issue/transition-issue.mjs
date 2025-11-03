import utils from "../../common/utils.mjs";
import jira from "../../jira.app.mjs";

export default {
  key: "jira-transition-issue",
  name: "Transition Issue",
  description: "Performs an issue transition and, if the transition has a screen, updates the fields from the transition screen. [See the documentation](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-issueidorkey-transitions-post)",
  version: "0.1.16",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    jira,
    cloudId: {
      propDefinition: [
        jira,
        "cloudId",
      ],
    },
    issueIdOrKey: {
      propDefinition: [
        jira,
        "issueIdOrKey",
        (c) => ({
          cloudId: c.cloudId,
        }),
      ],
    },
    transition: {
      propDefinition: [
        jira,
        "transition",
        (configuredProps) => ({
          issueIdOrKey: configuredProps.issueIdOrKey,
          cloudId: configuredProps.cloudId,
        }),
      ],
      optional: false,
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
      description: "List of operations to perform on issue screen fields. Note that fields included here cannot be included in fields.",
      optional: true,
    },
    historyMetadata: {
      type: "object",
      label: "History Metadata",
      description: "Additional issue history details. See `HistoryMetadata` section of [doc](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-issueidorkey-transitions-post)",
      optional: true,
    },
    properties: {
      type: "string",
      label: "Properties",
      description: "Details of issue properties to be add or update",
      optional: true,
    },
    additionalProperties: {
      type: "object",
      label: "Additional Properties",
      description: "Extra properties of any type may be provided to this object",
      optional: true,
    },
  },
  async run({ $ }) {
    const transition = {
      id: this.transition,
    };
    const fields = utils.parseObject(this.fields);
    const update = utils.parseObject(this.update);
    const historyMetadata = utils.parseObject(this.historyMetadata);
    const additionalProperties = utils.parseObject(this.additionalProperties);
    let properties;
    try {
      properties = JSON.parse(this.properties);
    } catch (err) {
      //pass
    }
    await this.jira.transitionIssue({
      $,
      cloudId: this.cloudId,
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
