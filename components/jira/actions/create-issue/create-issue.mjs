import utils from "../../common/utils.mjs";
import common from "../common/issue.mjs";
import { ConfigurationError } from "@pipedream/platform";

const {
  additionalProperties: commonAdditionalProperties,
  ...commonPropsRest
} = common.props;

export default {
  ...common,
  key: "jira-create-issue",
  name: "Create Issue",
  description: "Creates an issue or, where the option to create subtasks is enabled in Jira, a subtask. [See the documentation](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-post)",
  version: "1.0.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    ...commonPropsRest,
    updateHistory: {
      type: "boolean",
      label: "Update History",
      description: "Whether the project in which the issue is created is added to the user's **Recently viewed** project list, as shown under **Projects** in Jira",
      optional: true,
    },
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the project the issue will be created in. Use the **Get All Projects** action to look up project IDs.",
    },
    issueTypeId: {
      type: "string",
      label: "Issue Type",
      description: "An ID identifying the type of issue to create. Use the **Get Issue Types** action to look up issue type IDs for the project.",
    },
    additionalProperties: {
      ...commonAdditionalProperties,
      label: "Additional properties",
      description: `${commonAdditionalProperties.description} Required — at least one field (e.g. \`summary\`) must be provided to create the issue.`,
      optional: false,
    },
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
    } = this;

    if (!additionalProperties || Object.keys(additionalProperties).length === 0) {
      throw new ConfigurationError("Please provide at least one additional property");
    }

    const params = {
      updateHistory,
    };

    const response = await this.app.createIssue({
      $,
      cloudId,
      params,
      data: {
        fields: {
          ...this.formatAdfFields(this.parseFields(additionalProperties)),
          project: {
            id: projectId,
          },
          issuetype: {
            id: issueTypeId,
          },
        },
        historyMetadata: historyMetadata && utils.parseObject(historyMetadata),
        properties: utils.parse(properties),
        update: update && utils.parseObject(update),
      },
    });

    let browserUrl;
    try {
      const baseUrl = await this.app.getCloudBaseUrl(cloudId);
      browserUrl = baseUrl && response.key
        ? `${baseUrl}/browse/${response.key}`
        : undefined;
    } catch (e) {
      console.log("Could not enrich response with browser URL", e.message);
    }

    $.export("$summary", `Issue has been created successfuly. (ID:${response.id}, KEY:${response.key})`);

    return {
      ...response,
      browserUrl,
    };
  },
};
