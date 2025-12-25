import { ConfigurationError } from "@pipedream/platform";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";
import common from "../common/issue.mjs";

export default {
  ...common,
  key: "jira-update-issue",
  name: "Update Issue",
  description: "Updates an issue. A transition may be applied and issue properties updated as part of the edit. [See the documentation](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-issueidorkey-put)",
  version: "0.2.20",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    projectId: {
      propDefinition: [
        common.props.app,
        "projectID",
        ({ cloudId }) => ({
          cloudId,
        }),
      ],
    },
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
    issueTypeId: {
      reloadProps: true,
      propDefinition: [
        common.props.app,
        "issueType",
        ({
          cloudId, projectId,
        }) => ({
          cloudId,
          projectId,
        }),
      ],
      optional: true,
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
      description: "The ID of the issue transition. Retrieving options requires a static `issueIdOrKey`. Required when specifying a transition to undertake.",
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
    transitionLooped: {
      type: "boolean",
      label: "Transition Looped",
      description: "Whether the transition is looped",
      optional: true,
    },
  },
  async additionalProps() {
    const {
      cloudId,
      projectId,
      issueTypeId,
      issueIdOrKey,
    } = this;

    try {
      const { fields } = await this.app.getEditIssueMetadata({
        cloudId,
        issueIdOrKey,
      });

      return this.getDynamicFields({
        fields,
      });
    } catch {
      if (!issueTypeId) {
        throw new ConfigurationError("Please enter `projectId` and `IssueTypeId` to retrieve additional props.");
      }
      const {
        projects: [
          {
            issuetypes: [
              { fields = {} } = {},
            ],
          },
        ],
      } = await this.app.getCreateIssueMetadata({
        cloudId,
        params: {
          projectIds: projectId,
          issuetypeIds: issueTypeId,
          expand: "projects.issuetypes.fields",
        },
      });

      const keys = [
        constants.FIELD_KEY.ISSUETYPE,
        constants.FIELD_KEY.PROJECT,
      ];

      return this.getDynamicFields({
        fields,
        predicate: ({ key }) => !keys.includes(key),
      });
    }
  },
  async run({ $ }) {
    const {
      app,
      cloudId,
      issueIdOrKey,
      // eslint-disable-next-line no-unused-vars
      projectId,
      // eslint-disable-next-line no-unused-vars
      issueTypeId,
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
