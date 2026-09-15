import utils from "../../common/utils.mjs";
import common from "../common/issue.mjs";

export default {
  ...common,
  key: "jira-update-issue",
  name: "Update Issue",
  description: "Updates an issue. A transition may be applied and issue properties updated as part of the edit. [See the documentation](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-issueidorkey-put)",
  version: "1.0.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    ...common.props,
    issueIdOrKey: {
      type: "string",
      label: "Issue ID or Key",
      description: "The ID or key of the issue to update (e.g. `10001` or `PROJ-123`). Use the **Search Issues with JQL** action to look up issues.",
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
      type: "string",
      label: "Transition ID",
      description: "The ID of the issue transition. Use the **Get Transitions** action to look up transition IDs for the issue. Required when specifying a transition to undertake.",
      optional: true,
    },
    transitionLooped: {
      type: "boolean",
      label: "Transition Looped",
      description: "Whether the transition is looped",
      optional: true,
    },
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
    } = this;

    const transition = transitionId
      ? {
        id: transitionId,
        looped: transitionLooped,
      }
      : undefined;

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
        fields: this.formatAdfFields(utils.parseObject(additionalProperties)),
        historyMetadata: utils.parseObject(historyMetadata),
        properties: utils.parse(properties),
        update: utils.parseObject(update),
      },
      transition,
    });

    let browserUrl;
    let issueKey;
    try {
      const [
        baseUrl,
        issue,
      ] = await Promise.all([
        app.getCloudBaseUrl(cloudId),
        app.getIssue({
          $,
          cloudId,
          issueIdOrKey,
          params: {
            fields: "key",
          },
        }),
      ]);
      issueKey = issue.key;
      browserUrl = baseUrl && issue.key
        ? `${baseUrl}/browse/${issue.key}`
        : undefined;
    } catch (e) {
      console.log("Could not enrich response with browser URL", e.message);
    }

    $.export("$summary", `Issue with ID(or key): ${this.issueIdOrKey} has been updated.`);

    return {
      success: true,
      issueIdOrKey: issueKey || issueIdOrKey,
      browserUrl,
    };
  },
};
