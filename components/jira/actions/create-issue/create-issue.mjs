import utils from "../../common/utils.mjs";
import jira from "../../jira.app.mjs";

export default {
  key: "jira-create-issue",
  name: "Create Issue",
  description: "Creates an issue or, where the option to create subtasks is enabled in Jira, a subtask, [See the docs](https://developer.atlassian.com/cloud/jira/platform/rest/v3/#api-rest-api-3-issue-post)",
  version: "0.1.9",
  type: "action",
  props: {
    jira,
    cloudId: {
      propDefinition: [
        jira,
        "cloudId"
      ]
    },
    projectID: {
      propDefinition: [
        jira,
        "projectID",
        (c) => ({
          cloudId: c.cloudId
        })
      ],
    },
    issueType: {
      propDefinition: [
        jira,
        "issueType",
        (configuredProps) => ({
          projectID: configuredProps.projectID,
          cloudId: configuredProps.cloudId
        }),
      ],
    },
    summary: {
      type: "string",
      label: "Issue summary",
      description: "The title of the issue",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the issue",
      optional: true,
    },
    parentKey: {
      type: "string",
      label: "Parent key",
      description: "Key of the project where the issue to create pertains.",
      optional: true,
    },
    components: {
      type: "any",
      label: "Components",
      description: "Array of components of the issue.",
      optional: true,
    },
    reporterId: {
      label: "Reporter ID",
      description: "Reporter ID of the issue.",
      propDefinition: [
        jira,
        "accountId",
        (c) => ({
          cloudId: c.cloudId
        })
      ],
      optional: true,
    },
    labels: {
      propDefinition: [
        jira,
        "labels",
      ],
    },
    duedate: {
      type: "string",
      label: "Due date",
      description: "Due date estimated for the issue.",
      optional: true,
    },
    assigneeId: {
      propDefinition: [
        jira,
        "accountId",
        (c) => ({
          cloudId: c.cloudId
        })
      ],
      optional: true,
    },
    priorityName: {
      type: "string",
      label: "Priority name",
      description: "Name of the issue priority, e.g. `Medium`",
      optional: true,
    },
    originalEstimate: {
      type: "integer",
      label: "Original estimate",
      description: "The original estimate component of the issue timetracking property. It indicates the time estimated to complete the issue.",
      optional: true,
    },
    remainingEstimate: {
      type: "integer",
      label: "Remaining estimate",
      description: "The remaining estimate component of the issue timetracking property. It indicates the time remaining to complete the issue.",
      optional: true,
    },
    securityId: {
      type: "integer",
      label: "Security level ID",
      description: "Id of the issue's security level.",
      optional: true,
    },
    customFields: {
      type: "object",
      label: "Custom fields",
      description: "Custom fields object of the issue. Depends on each Jira instance.",
      optional: true,
    },
    updateHistory: {
      type: "boolean",
      label: "Update history",
      description: "Whether the project in which the issue is created is added to the user's **Recently viewed** project list, as shown under **Projects** in Jira.",
      optional: true,
    },
    update: {
      type: "object",
      label: "Update",
      description: "A Map containing the field name and a list of operations to perform on the issue screen field. Note that fields included in here cannot be included in `fields`.",
      optional: true,
    },
    transition: {
      propDefinition: [
        jira,
        "transition",
        (c) => ({
          cloudId: c.cloudId
        })
      ],
      type: "string",
    },
    historyMetadata: {
      type: "object",
      label: "History metadata",
      description: "Additional issue history details.",
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
    const customFields = utils.parseObject(this.customFields);
    const fields = {
      summary: this.summary,
      issuetype: {
        id: this.issueType,
      },
      components: this.components,
      project: {
        id: this.projectID,
      },
      labels: this.labels,
      duedate: this.duedate,
      ...customFields,
    };
    if (this.reporterId) {
      fields.reporter = {
        id: this.reporterId,
      };
    }
    if (this.description) {
      fields.description = {
        type: "doc",
        version: 1,
        content: [
          {
            type: "paragraph",
            content: [
              {
                text: this.description,
                type: "text",
              },
            ],
          },
        ],
      };
    }
    if (this.parentKey) {
      fields.parent = {
        key: this.parentKey,
      };
    }
    if (this.assigneeId) {
      fields.assignee = {
        id: this.assigneeId,
      };
    }
    if (this.priorityName) {
      fields.priority = {
        name: this.priorityName,
      };
    }
    if (this.remainingEstimate) {
      fields.timetracking = {
        remainingEstimate: this.remainingEstimate,
      };
    }
    if (this.originalEstimate) {
      fields.timetracking = {
        ...fields.timetracking,
        originalEstimate: this.originalEstimate,
      };
    }
    if (this.securityId) {
      fields.security = {
        id: this.securityId,
      };
    }
    const update = utils.parseObject(this.update);
    const transition = this.transition;
    const historyMetadata = utils.parseObject(this.historyMetadata);
    const additionalProperties = utils.parseObject(this.additionalProperties);
    let properties;
    try {
      properties = JSON.parse(this.properties);
    } catch (err) {
      console.log("Ignoring properties param, parsing failure: ", err);
    }
    const response = await this.jira.createIssue({
      $,
      cloudId,
      params: {
        updateHistory: this.updateHistory,
      },
      data: {
        fields,
        update,
        historyMetadata,
        properties,
        transition,
        ...additionalProperties,
      },
    });
    $.export("$summary", `Issue has been created successfuly. (ID:${response.id}, KEY:${response.key})`);
    return response;
  },
};
