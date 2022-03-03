// legacy_hash_id: a_0Mi2KV
import { axios } from "@pipedream/platform";

export default {
  key: "jira-create-issue",
  name: "Create Issue",
  description: "Creates an issue or, where the option to create subtasks is enabled in Jira, a subtask.",
  version: "0.1.2",
  type: "action",
  props: {
    jira: {
      type: "app",
      app: "jira",
    },
    summary: {
      type: "string",
      label: "Issue Summary",
      description: "The title of the issue",
    },
    parent_key: {
      type: "string",
      description: "Key of the project where the issue to create pertains.",
      optional: true,
    },
    issuetype: {
      type: "string",
      label: "Issue Type",
      description: "An ID identifying the type of issue you'd like to create. See the API docs at https://developer.atlassian.com/cloud/jira/platform/rest/v3/#api-rest-api-3-issue-post to see available options",
      optional: true,
    },
    components: {
      type: "any",
      description: "Array of components of the issue.",
      optional: true,
    },
    projectID: {
      type: "string",
      description: "The ID of the project where the issue will be created.",
    },
    description: {
      type: "object",
      description: "Description object of the issue.",
    },
    reporter_id: {
      type: "string",
    },
    fixVersions: {
      type: "any",
      optional: true,
    },
    labels: {
      type: "any",
      description: "Labels associated to the issue, such as \"bugfix\", \"blitz_test\".",
      optional: true,
    },
    environment: {
      type: "object",
      description: "Environment object where the issue was found.",
      optional: true,
    },
    versions: {
      type: "any",
      description: "Array of versions id where this issue applies.",
      optional: true,
    },
    duedate: {
      type: "string",
      description: "Due date estimated for fixing the issue.",
      optional: true,
    },
    assignee_id: {
      type: "string",
      description: "User assigned to fixing the issue.",
      optional: true,
    },
    priority_id: {
      type: "string",
      description: "Id of the issue priority.",
      optional: true,
    },
    originalEstimate: {
      type: "integer",
      description: "The original estimate component of the issue timetracking property. It indicates the time estimated to complete the issue.",
      optional: true,
    },
    remainingEstimate: {
      type: "integer",
      description: "The remaining estimate component of the issue timetracking property. It indicates the time remaining to complete the issue.",
      optional: true,
    },
    security_id: {
      type: "integer",
      description: "Id of the issue's security level.",
      optional: true,
    },
    custom_fields: {
      type: "object",
      description: "Custom fields object of the issue. Depends on each Jira instance.",
      optional: true,
    },
    updateHistory: {
      type: "boolean",
      description: "Whether the project in which the issue is created is added to the user's **Recently viewed** project list, as shown under **Projects** in Jira.",
      optional: true,
    },
    transition: {
      type: "object",
      description: "Details of a transition. Required when performing a transition, optional when creating or editing an issue.",
      optional: true,
    },
    update: {
      type: "object",
      description: "List of operations to perform on issue screen fields. Note that fields included in here cannot be included in `fields.`",
      optional: true,
    },
    historyMetadata: {
      type: "object",
      description: "Additional issue history details.",
      optional: true,
    },
    properties: {
      type: "any",
      description: "Details of issue properties to be add or update.",
      optional: true,
    },
    additional_properties: {
      type: "object",
      description: "Extra properties of any type may be provided to this object.",
      optional: true,
    },
  },
  async run({ $ }) {
  // First we must make a request to get our the cloud instance ID tied
  // to our connected account, which allows us to construct the correct REST API URL. See Section 3.2 of
  // https://developer.atlassian.com/cloud/jira/platform/oauth-2-authorization-code-grants-3lo-for-apps/
    const resp = await axios($, {
      url: "https://api.atlassian.com/oauth/token/accessible-resources",
      headers: {
        Authorization: `Bearer ${this.jira.$auth.oauth_access_token}`,
      },
    });

    // Assumes the access token has access to a single instance
    const cloudId = resp[0].id;

    //Prepares the fields object of the request.
    var fields = {
      summary: this.summary,
      parent: {
        key: this.parent_key,
      },
      issuetype: {
        id: this.issuetype,
      },
      components: this.components,
      project: {
        id: this.projectID,
      },
      description: this.description,
      reporter: {
        id: this.reporter_id,
      },
      fixVersions: this.fixVersions,
      labels: this.labels,
      environment: this.environment,
      versions: this.versions,
      duedate: this.duedate,
      assignee: {
        id: this.assignee_id,
      },
    };

    if (this.priority_id) {
      fields["priority"] = {
        id: this.priority_id,
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
        id: this.security_id,
      };
    }

    // Adds custom fields
    if (this.custom_fields) {
      var customFieldsArr = Object.keys(this.custom_fields);
      for (var i = 0; i < customFieldsArr.length; i++) {
        fields[customFieldsArr[i]] = this.custom_fields[customFieldsArr[i]];
      }
    }

    // See https://developer.atlassian.com/cloud/jira/platform/rest/v3/#api-rest-api-3-issue-post
    // for all options
    return await axios($, {
      method: "post",
      url: `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/issue`,
      headers: {
        "Authorization": `Bearer ${this.jira.$auth.oauth_access_token}`,
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      params: {
        updateHistory: this.updateHistory,
      },
      data: {
        "transition": this.transition,
        fields,
        "update": this.update,
        "historyMetadata": this.historyMetadata,
        "properties": this.properties,
        "Additional Properties": this.additional_properties,
      },
    });
  },
};
