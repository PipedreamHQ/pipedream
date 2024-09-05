import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";
import common from "../common/issue.mjs";

export default {
  ...common,
  key: "jira-create-issue",
  name: "Create Issue",
  description: "Creates an issue or, where the option to create subtasks is enabled in Jira, a subtask, [See the docs](https://developer.atlassian.com/cloud/jira/platform/rest/v3/#api-rest-api-3-issue-post)",
  version: "0.1.17",
  type: "action",
  props: {
    ...common.props,
    updateHistory: {
      type: "boolean",
      label: "Update history",
      description: "Whether the project in which the issue is created is added to the user's **Recently viewed** project list, as shown under **Projects** in Jira.",
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
  async additionalProps() {
    const {
      cloudId,
      projectId,
      issueTypeId,
    } = this;

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
        fields,
        historyMetadata: utils.parseObject(historyMetadata),
        properties: utils.parse(properties),
        update: utils.parseObject(update),
        ...utils.parseObject(additionalProperties),
      },
    });

    $.export("$summary", `Issue has been created successfuly. (ID:${response.id}, KEY:${response.key})`);

    return response;
  },
};
