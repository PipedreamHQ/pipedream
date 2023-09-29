import { axios } from "@pipedream/platform";
// import jira_service_desk from "../../jira_service_desk.app.mjs";

export default {
  key: "jira_service_desk-comment-on-request",
  name: "Comment on Request",
  description: "Create a comment on a customer request. [See the documentation](https://developer.atlassian.com/cloud/jira/service-desk/rest/api-group-request/#api-rest-servicedeskapi-request-issueidorkey-comment-post)",
  version: "0.0.1",
  type: "action",
  props: {
    jira_service_desk: {
      type: "app",
      app: "jira_service_desk",
    },
    issueIdOrKey: {
      type: "string",
      label: "Issue ID or Key",
      description: "The ID or key of the issue",
    },
    body: {
      type: "string",
      label: "Comment Body",
      description: "The content of the comment",
    },
    visibility: {
      type: "string",
      label: "Visibility",
      description: "The group or role to which this comment will be visible",
      optional: true,
    },
  },
  methods: {
    async createComment({
      $, issueIdOrKey, body, visibility,
    }) {
      return axios($, {
        method: "POST",
        url: `https://api.atlassian.com/ex/jira/${this.jira_service_desk.$auth.oauth_uid}/rest/servicedeskapi/request/${issueIdOrKey}/comment`,
        headers: {
          Authorization: `Bearer ${this.jira_service_desk.$auth.oauth_access_token}`,
          Accept: "application/json",
        },
        data: {
          body,
          visibility,
        },
      });
    },
  },
  async run({ /*steps,*/ $ }) {
    const {
      issueIdOrKey, body, visibility,
    } = this;
    const response = await this.createComment({
      $,
      issueIdOrKey,
      body,
      visibility,
    });
    $.export("$summary", "Successfully created comment on request");
    return response;
  },
};
