import base from "../common/base.mjs";
import utils from "../common/utils.mjs";

const { jira } = base.props;

export default {
  ...base,
  key: "jira-update-issue",
  name: "Update Issue",
  description: "Updates an issue. A transition may be applied and issue properties updated as part of the edit. [See docs here](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-issueidorkey-put)",
  version: "0.2.0",
  type: "action",
  props: {
    ...base.props,
    issueId: {
      propDefinition: [
        jira,
        "issueId",
        (c) => ({
          cloudId: c.cloudId,
        }),
      ],
    },
    notifyUsers: {
      label: "Notify Users",
      description: "Whether a notification email about the issue update is sent to all watchers. To disable the notification, administer Jira or administer project permissions are required. If the user doesn't have the necessary permission the request is ignored.",
      type: "boolean",
      optional: true,
    },
    overrideScreenSecurity: {
      label: "Override Screen Security",
      type: "boolean",
      description: "Whether screen security should be overridden to enable hidden fields to be edited. Available to Connect app users with admin permissions.",
      optional: true,
    },
    overrideEditableFlag: {
      label: "Override Editable Flag",
      type: "boolean",
      description: "Whether screen security should be overridden to enable uneditable fields to be edited. Available to Connect app users with admin permissions.",
      optional: true,
    },
    transition: {
      label: "Transition",
      type: "string",
      description: "Details of a transition. Required when performing a transition, optional when creating or editing an issue.",
      optional: true,
    },
    fields: {
      label: "Fields",
      description: "List of issue screen fields to update, specifying the sub-field to update and its value for each field. This field provides a straightforward option when setting a sub-field. When multiple sub-fields or other operations are required, use `update`. Fields included in here cannot be included in `update`.",
      type: "string",
      optional: true,
    },
    update: {
      label: "Update",
      type: "string",
      description: "List of operations to perform on issue screen fields. Note that fields included in here cannot be included in `fields.`",
      optional: true,
    },
    histMetaType: {
      label: "Hist Meta Type",
      description: "The type of the history record, part of the details in issue history metadata.",
      type: "string",
      optional: true,
    },
    histMetaDescription: {
      label: "Hist Meta Description",
      description: "The description of the history record, part of the details in issue history metadata.",
      type: "string",
      optional: true,
    },
    histMetaDescriptionKey: {
      label: "Hist Meta Description Key",
      description: "The description key of the history record, part of the details in issue history metadata.",
      type: "string",
      optional: true,
    },
    histMetaActivityDescription: {
      label: "Hist Meta Activity Description",
      description: "The activity described in the history record, part of the details in issue history metadata.",
      type: "string",
      optional: true,
    },
    histMetaActivityDescriptionKey: {
      label: "Hist Meta Activity Description Key",
      description: "The key of the activity described in the history record, part of the details in issue history metadata.",
      type: "string",
      optional: true,
    },
    histMetaEmailDescription: {
      label: "Hist Meta Email Description",
      description: "The description of the email address associated the history record, part of the details in issue history metadata.",
      type: "string",
      optional: true,
    },
    histMetaEmailDescriptionKey: {
      label: "Hist Meta Email Description Key",
      description: "The description key of the email address associated the history record, part of the details in issue history metadata.",
      type: "string",
      optional: true,
    },
    histMetaActor: {
      label: "Hist Meta Actor",
      type: "string",
      description: "Details of the user whose action created the history record, part of the details in issue history metadata.",
      optional: true,
    },
    histMetaGenerator: {
      label: "Hist Meta Generator",
      type: "string",
      description: "Details of the system that generated the history record, part of the details in issue history metadata.",
      optional: true,
    },
    histMetaCause: {
      label: "Hist Meta Cause",
      type: "string",
      description: "Details of the cause that triggered the creation the history record, part of the details in issue history metadata.",
      optional: true,
    },
    histMetaExtraData: {
      label: "Hist Meta Extra Data",
      type: "string",
      description: "Additional arbitrary information about the history record, part of the details in issue history metadata.",
      optional: true,
    },
    histMetaAdditionalProperties: {
      label: "Hist Meta Additional Properties",
      type: "string",
      description: "Extra properties of any type may be provided to this object.",
      optional: true,
    },
    properties: {
      label: "Properties",
      type: "string",
      description: "Details of issue properties to be add or update.",
      optional: true,
    },
    additionalProperties: {
      label: "Additional Properties",
      type: "string",
      description: "Extra properties of any type may be provided to this object.",
      optional: true,
    },
  },
  async run({ $ }) {
    const transitionParsed = utils.parseStringToJSON(this.transition);
    const updateParsed = utils.parseStringToJSON(this.update);
    const histMetaActorParsed = utils.parseStringToJSON(this.histMetaActor);
    const histMetaGeneratorParsed = utils.parseStringToJSON(this.histMetaGenerator);
    const histMetaCauseParsed = utils.parseStringToJSON(this.histMetaCause);
    const histMetaExtraDataParsed = utils.parseStringToJSON(this.histMetaExtraData);
    const histMetaAdditionalPropertiesParsed = utils.parseStringToJSON(
      this.histMetaAdditionalProperties,
    );
    const propertiesParsed = utils.parseStringToJSON(this.properties);
    const additionalPropertiesParsed = utils.parseStringToJSON(this.additionalProperties);

    const response = await this.jira.updateIssue({
      $,
      cloudId: this.cloudId,
      issueId: this.issueId,
      params: {
        notifyUsers: this.notifyUsers,
        overrideScreenSecurity: this.overrideScreenSecurity,
        overrideEditableFlag: this.overrideEditableFlag,
      },
      data: {
        "transition": transitionParsed,
        "fields": this.fields,
        "update": updateParsed,
        "historyMetadata": {
          "type": this.histMetaType,
          "description": this.histMetaDescription,
          "descriptionKey": this.histMetaDescriptionKey,
          "activityDescription": this.histMetaActivityDescription,
          "activityDescriptionKey": this.histMetaActivityDescriptionKey,
          "emailDescription": this.histMetaEmailDescription,
          "emailDescriptionKey": this.histMetaEmailDescriptionKey,
          "actor": histMetaActorParsed,
          "generator": histMetaGeneratorParsed,
          "cause": histMetaCauseParsed,
          "extraData": histMetaExtraDataParsed,
          "Additional Properties": histMetaAdditionalPropertiesParsed,
        },
        "properties": propertiesParsed,
        "Additional Properties": additionalPropertiesParsed,
      },
    });

    $.export("$summary", "Successfully updated issue");

    return response;
  },
};
