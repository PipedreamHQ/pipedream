import utils from "../../common/utils.mjs";
import common from "../common/issue.mjs";

export default {
  ...common,
  key: "jira-update-issue",
  name: "Update Issue",
  description: "Updates an issue. A transition may be applied and issue properties updated as part of the edit, [See the docs](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-issueidorkey-put)",
  version: "0.2.7",
  type: "action",
  props: {
    ...common.props,
    issueIdOrKey: {
      reloadProps: true,
      propDefinition: [
        common.props.app,
        "issueIdOrKey",
        ({ cloudId }) => ({
          cloudId,
        }),
      ],
    },
    notifyUsers: {
      type: "boolean",
      label: "Notify Users",
      description: "Whether a notification email about the issue update is sent to all watchers. To disable the notification, administer Jira or administer project permissions are required. If the user doesn't have the necessary permission the request is ignored.",
      optional: true,
    },
    overrideScreenSecurity: {
      type: "boolean",
      label: "Override Screen Security",
      description: "Whether screen security should be overridden to enable hidden fields to be edited. Available to Connect app users with admin permissions.",
      optional: true,
    },
    overrideEditableFlag: {
      type: "boolean",
      label: "Override Editable Flag",
      description: "Whether screen security should be overridden to enable uneditable fields to be edited. Available to Connect app users with admin permissions.",
      optional: true,
    },
    transitionId: {
      label: "Transition ID",
      description: "The ID of the issue transition. Required when specifying a transition to undertake.",
      propDefinition: [
        common.props.app,
        "transition",
        ({
          cloudId, issueIdOrKey,
        }) => ({
          cloudId,
          issueIdOrKey,
        }),
      ],
    },
  },
  async additionalProps() {
    const {
      cloudId,
      issueIdOrKey,
    } = this;

    const { fields } = await this.app.getEditIssueMetadata({
      cloudId,
      issueIdOrKey,
    });

    return this.getDynamicFields({
      fields,
    });
  },
  async run({ $ }) {
    const {
      app,
      cloudId,
      issueIdOrKey,
      notifyUsers,
      overrideScreenSecurity,
      overrideEditableFlag,
      historyMetadata,
      properties,
      transitionId,
      transitionLooped,
      update,
      additionalProperties,
      ...dynamicFields
    } = this;

    const fields = utils.reduceProperties({
      additionalProps: this.formatFields(dynamicFields),
    });

    const { transition } = utils.reduceProperties({
      additionalProps: {
        transition: [
          transitionId,
          {
            id: transitionId,
            looped: transitionLooped,
          },
        ],
      },
    });

    const params = utils.reduceProperties({
      additionalProps: {
        notifyUsers,
        overrideScreenSecurity,
        overrideEditableFlag,
      },
    });

    await app.updateIssue({
      $,
      cloudId,
      issueIdOrKey,
      params,
      data: {
        fields,
        historyMetadata: utils.parseObject(historyMetadata),
        properties: utils.parse(properties),
        update: utils.parseObject(update),
        ...utils.parseObject(additionalProperties),
      },
      transition,
    });

    $.export("$summary", `Issue with ID(or key): ${this.issueIdOrKey} has been updated.`);

    return {
      success: true,
      issueIdOrKey,
    };
  },
};
