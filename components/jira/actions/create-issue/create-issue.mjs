import jira from "../../jira.app.mjs";

export default {
  key: "jira-create-issue",
  name: "Create Issue",
  description: "Creates an issue or, where the option to create subtasks is enabled in Jira, a subtask, [See the docs](https://developer.atlassian.com/cloud/jira/platform/rest/v3/#api-rest-api-3-issue-post)",
  version: "0.1.3",
  type: "action",
  props: {
    jira,
    projectID: {
      propDefinition: [
        jira,
        "projectID",
      ],
    },
    issueType: {
      propDefinition: [
        jira,
        "issueType",
        (configuredProps) => ({
          projectID: configuredProps.projectID,
        }),
      ],
    },
    summary: {
      type: "string",
      label: "Issue summary",
      description: "The title of the issue",
    },
    description: {
      type: "object",
      label: "Description",
      description: "Description object of the issue, Jira accepts `doc` type of descriptions, [See Atlassian Document Structure](https://developer.atlassian.com/cloud/jira/platform/apis/document/structure/)",
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
      type: "string",
      label: "Reporter ID",
      description: "Reporter ID of the issue.",
    },
    labels: {
      type: "any",
      label: "Labels",
      description: "Labels associated to the issue, such as \"bugfix\", \"blitz_test\".",
      optional: true,
    },
    duedate: {
      type: "string",
      label: "Due date",
      description: "Due date estimated for the issue.",
      optional: true,
    },
    assigneeId: {
      type: "string",
      label: "Assignee ID",
      description: "ID of the user assigned to the issue.",
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
      type: "object",
      label: "Transition",
      description: "Details of a transition. Required when performing a transition, optional when creating or editing an issue, See `Transition` section of [doc](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-issueidorkey-put)",
      optional: true,
    },
    historyMetadata: {
      type: "object",
      label: "History metadata",
      description: "Additional issue history details.",
      optional: true,
    },
    properties: {
      type: "string",
      label: "Properties",
      description: "Details of issue properties to be add or update, please provide an array of objects with keys and values.",
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
    const fields = {
      summary: this.summary,
      issuetype: {
        id: this.issueType,
      },
      components: this.components,
      project: {
        id: this.projectID,
      },
      reporter: {
        id: this.reporterId,
      },
      labels: this.labels,
      duedate: this.duedate,
      ...this.customFields,
    };
    const description = this.jira.parseObject(this.description);
    fields.description = description;
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
    const update = this.jira.parseObject(this.update);
    const transition = this.jira.parseObject(this.transition);
    const historyMetadata = this.jira.parseObject(this.historyMetadata);
    const additionalProperties = this.jira.parseObject(this.additionalProperties);
    const properties = this.properties ?
      JSON.parse(this.properties) :
      undefined;

    const response = await this.jira.createIssue({
      $,
      params: {
        updateHistory: this.updateHistory,
      },
      data: {
        fields,
        update,
        transition,
        historyMetadata,
        properties,
        ...additionalProperties,
      },
    });
    $.export("$summary", `Issue has been created successfuly. (ID:${response.id}, KEY:${response.key})`);
    return response;
  },
};
