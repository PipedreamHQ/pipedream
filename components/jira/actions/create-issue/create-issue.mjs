import { ConfigurationError } from "@pipedream/platform";
import base from "../common/base.mjs";
import utils from "../common/utils.mjs";

export default {
  ...base,
  key: "jira-create-issue",
  name: "Create Issue",
  description: "Creates an issue or, where the option to create subtasks is enabled in Jira, a subtask. [See docs here](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/#api-rest-api-3-issue-post) ",
  version: "0.2.0",
  type: "action",
  props: {
    ...base.props,
    summary: {
      label: "Issue Summary",
      description: "The title of the issue",
      type: "string",
    },
    parentKey: {
      label: "parentKey",
      description: "Key of the project where the issue to create pertains.",
      type: "string",
      optional: true,
    },
    issueType: {
      label: "Issue Type",
      description: "An ID identifying the type of issue you'd like to create. See the API docs at https://developer.atlassian.com/cloud/jira/platform/rest/v3/#api-rest-api-3-issue-post to see available options",
      type: "string",
      optional: true,
    },
    components: {
      label: "Components",
      description: "Array of components of the issue.",
      type: "string[]",
      optional: true,
    },
    projectId: {
      label: "Project ID",
      description: "The ID of the project where the issue will be created.",
      type: "string",
    },
    description: {
      label: "Description",
      description: "Description object of the issue.",
      type: "string",
      optional: true,
    },
    reporterId: {
      label: "Reporter ID",
      description: "The ID of the reporter",
      type: "string",
      optional: true,
    },
    fixVersions: {
      label: "Fix Versions",
      description: "The fix versions",
      type: "string[]",
      optional: true,
    },
    labels: {
      label: "Labels",
      description: "Labels associated to the issue, such as \"bugfix\", \"blitz_test\".",
      type: "string[]",
      optional: true,
    },
    environment: {
      label: "Environment",
      description: "Environment object where the issue was found.",
      type: "string",
      optional: true,
    },
    versions: {
      label: "Versions",
      type: "string[]",
      description: "Array of versions id where this issue applies.",
      optional: true,
    },
    dueDate: {
      label: "Due Date",
      type: "string",
      description: "Due date estimated for fixing the issue.",
      optional: true,
    },
    assigneeId: {
      label: "Assignee ID",
      type: "string",
      description: "User assigned to fixing the issue.",
      optional: true,
    },
    priorityId: {
      label: "Priority Id",
      type: "string",
      description: "Id of the issue priority.",
      optional: true,
    },
    originalEstimate: {
      label: "Original Estimate",
      type: "integer",
      description: "The original estimate component of the issue timetracking property. It indicates the time estimated to complete the issue.",
      optional: true,
    },
    remainingEstimate: {
      label: "Remaining Estimate",
      type: "integer",
      description: "The remaining estimate component of the issue timetracking property. It indicates the time remaining to complete the issue.",
      optional: true,
    },
    securityId: {
      label: "Security ID",
      type: "integer",
      description: "Id of the issue's security level.",
      optional: true,
    },
    customFields: {
      label: "Custom Fields",
      type: "string",
      description: "Custom fields object of the issue. Depends on each Jira instance.",
      optional: true,
    },
    updateHistory: {
      label: "Update History",
      type: "boolean",
      description: "Whether the project in which the issue is created is added to the user's **Recently viewed** project list, as shown under **Projects** in Jira.",
      optional: true,
    },
    transition: {
      label: "Transition",
      type: "string",
      description: "Details of a transition. Required when performing a transition, optional when creating or editing an issue.",
      optional: true,
    },
    update: {
      label: "Update",
      type: "string",
      description: "List of operations to perform on issue screen fields. Note that fields included in here cannot be included in `fields.`",
      optional: true,
    },
    historyMetadata: {
      label: "History Metadata",
      type: "string",
      description: "Additional issue history details.",
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
    if (!this.description && !this.reporterId) {
      throw new ConfigurationError("This action requires either Description or Reporter ID.");
    }

    const componentsParsed = utils.parseStringToJSON(this.components);
    const descriptionParsed = utils.parseStringToJSON(this.description);
    const fixVersionsParsed = utils.parseStringToJSON(this.fixVersions);
    const labelsParsed = utils.parseStringToJSON(this.labels);
    const environmentParsed = utils.parseStringToJSON(this.environment);
    const versionsParsed = utils.parseStringToJSON(this.versions);
    const customFieldsParsed = utils.parseStringToJSON(this.customFields);
    const transitionParsed = utils.parseStringToJSON(this.transition);
    const updateParsed = utils.parseStringToJSON(this.update);
    const historyMetadataParsed = utils.parseStringToJSON(this.historyMetadata);
    const propertiesParsed = utils.parseStringToJSON(this.properties);
    const additionalPropertiesParsed = utils.parseStringToJSON(this.additionalProperties);

    var fields = {
      summary: this.summary,
      parent: {
        key: this.parentKey,
      },
      issuetype: {
        id: this.issuetype,
      },
      components: componentsParsed,
      project: {
        id: this.projectID,
      },
      description: descriptionParsed,
      reporter: {
        id: this.reporter_id,
      },
      fixVersions: fixVersionsParsed,
      labels: labelsParsed,
      environment: environmentParsed,
      versions: versionsParsed,
      duedate: this.duedate,
      assignee: {
        id: this.assignee_id,
      },
    };

    if (this.priority_id) {
      fields["priority"] = {
        id: this.priorityId,
      };
    }

    if (this.originalEstimate || this.remainingEstimate) {
      fields["timetracking"] = new Object();

      if (this.remainingEstimate) {
        fields["timetracking"]["remainingEstimate"] = this.remainingEstimate;
      }

      if (this.originalEstimate) {
        fields["timetracking"]["originalEstimate"] = this.originalEstimate;
      }
    }

    if (this.security_id) {
      fields["security"] = {
        id: this.securityId,
      };
    }

    // Adds custom fields
    if (this.custom_fields) {
      var customFieldsArr = Object.keys(customFieldsParsed);
      for (var i = 0; i < customFieldsArr.length; i++) {
        fields[customFieldsArr[i]] = customFieldsParsed[customFieldsArr[i]];
      }
    }

    const response = await this.jira.createIssue({
      $,
      projectId: this.projectId,
      params: {
        updateHistory: this.updateHistory,
      },
      data: {
        fields,
        transition: transitionParsed,
        update: updateParsed,
        historyMetadata: historyMetadataParsed,
        updateHistory: this.updateHistory,
        properties: propertiesParsed,
        ...additionalPropertiesParsed,
      },
    });

    $.export("$summary", "Successfully created issue");

    return response;
  },
};
