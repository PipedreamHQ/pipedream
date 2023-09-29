import jiraServiceDesk from "../../jira_service_desk.app.mjs";

export default {
  key: "jira_service_desk-create-request",
  name: "Create Request",
  description:
    "Creates a new customer request. [See the documentation](https://developer.atlassian.com/cloud/jira/service-desk/rest/api-group-request/#api-rest-servicedeskapi-request-post)",
  version: "0.0.1",
  type: "action",
  props: {
    jiraServiceDesk,
    serviceDeskId: {
      propDefinition: [
        jiraServiceDesk,
        "serviceDeskId",
      ],
    },
    requestTypeId: {
      propDefinition: [
        jiraServiceDesk,
        "requestTypeId",
        ({ serviceDeskId }) => ({
          serviceDeskId,
        }),
      ],
    },
    requestFieldValues: {
      type: "object",
      label: "Request Field Values",
      description: "The values for the fields of the request",
    },
  },
  async run({ $ }) {
    const response = await this.createRequest({
      $,
      requestData: this.requestData,
    });
    $.export("$summary", "Successfully created request");
    return response;
  },
};
