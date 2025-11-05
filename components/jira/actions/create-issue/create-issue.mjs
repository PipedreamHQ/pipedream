import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";
import common from "../common/issue.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  ...common,
  key: "jira-create-issue",
  name: "Create Issue",
  description: "Creates an issue or, where the option to create subtasks is enabled in Jira, a subtask. [See the documentation](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-post)",
  version: "0.1.26",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    updateHistory: {
      type: "boolean",
      label: "Update History",
      description: "Whether the project in which the issue is created is added to the user's **Recently viewed** project list, as shown under **Projects** in Jira",
      optional: true,
    },
    projectId: {
      propDefinition: [
        common.props.app,
        "projectID",
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
    },
  },
  async additionalProps(existingProps) {
    const {
      cloudId,
      projectId,
      issueTypeId,
    } = this;

    if (isNaN(projectId) || !cloudId || !isNaN(issueTypeId)) {
      existingProps.additionalProperties.optional = false;
      return {};
    }

    try {
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

      existingProps.additionalProperties.optional = true;
      return this.getDynamicFields({
        fields,
        predicate: ({ key }) => !keys.includes(key),
      });
    } catch {
      existingProps.additionalProperties.optional = false;
      return {};
    }
  },
  async run({ $ }) {
    const {
      // eslint-disable-next-line no-unused-vars
      app,
      cloudId,
      projectId,
      issueTypeId,
      updateHistory,
      historyMetadata,
      properties,
      update,
      additionalProperties,
      ...dynamicFields
    } = this;

    if ((!dynamicFields || Object.keys(dynamicFields).length === 0)
      && (!additionalProperties || Object.keys(additionalProperties).length === 0)
    ) {
      throw new ConfigurationError("Please provide at least one additional property");
    }

    const fields = utils.reduceProperties({
      initialProps: {
        project: {
          id: projectId,
        },
        issuetype: {
          id: issueTypeId,
        },
      },
      additionalProps: this.formatFields(dynamicFields),
    });

    const params = utils.reduceProperties({
      additionalProps: {
        updateHistory,
      },
    });

    const response = await this.app.createIssue({
      $,
      cloudId,
      params,
      data: {
        fields: {
          ...utils.parseObject(additionalProperties),
          ...fields,
        },
        historyMetadata: utils.parseObject(historyMetadata),
        properties: utils.parse(properties),
        update: utils.parseObject(update),
      },
    });

    $.export("$summary", `Issue has been created successfuly. (ID:${response.id}, KEY:${response.key})`);

    return response;
  },
};
