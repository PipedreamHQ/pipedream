import axios from "@pipedream/platform";
// import jiraServiceDesk from "../../jira_service_desk.app.mjs";

export default {
  key: "jira_service_desk-create-request",
  name: "Create Request",
  description: "Creates a new customer request. [See the documentation](https://developer.atlassian.com/cloud/jira/service-desk/rest/api-group-request/#api-rest-servicedeskapi-request-post)",
  version: "0.0.1",
  type: "action",
  props: {
    jiraServiceDesk: {
      type: "app",
      app: "jira_service_desk",
    },
    requestData: {
      type: "object",
      label: "Request Data",
      description: "The data for the new request. Should include 'serviceDeskId', 'requestTypeId' and 'requestFieldValues'.",
    },
  },
  methods: {
    async createRequest({
      $, requestData,
    }) {
      return axios($, {
        method: "POST",
        url: `https://api.atlassian.com/ex/jira/${this.jiraServiceDesk.$auth.oauth_uid}/rest/servicedeskapi/request`,
        headers: {
          "Authorization": `Bearer ${this.jiraServiceDesk.$auth.oauth_access_token}`,
          "Content-Type": "application/json",
        },
        data: requestData,
      });
    },
  },
  async run({ /*steps,*/ $ }) {
    const response = await this.createRequest({
      $,
      requestData: this.requestData,
    });
    $.export("$summary", "Successfully created request");
    return response;
  },
};
