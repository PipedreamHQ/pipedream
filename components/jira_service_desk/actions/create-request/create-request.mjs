import { ConfigurationError } from "@pipedream/platform";
import jiraServiceDesk from "../../jira_service_desk.app.mjs";

export default {
  key: "jira_service_desk-create-request",
  name: "Create Request",
  description:
    "Creates a new customer request. [See the documentation](https://docs.atlassian.com/jira-servicedesk/REST/3.6.2/#servicedeskapi/request-createCustomerRequest)",
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
      type: "string",
      label: "Request Field Values",
      description:
        "The values for the fields of the request. This should be a JSON-stringified object. [See the documentation here.](https://docs.atlassian.com/jira-servicedesk/REST/3.6.2/#fieldformats)",
    },
    requestParticipants: {
      type: "string[]",
      label: "Request Participants",
      description:
        "Not available to users who only have the Service Desk customer permission.",
      optional: true,
    },
  },
  async run({ $ }) {
    let requestFieldValues;
    try {
      requestFieldValues = JSON.parse(this.requestFieldValues);
    } catch (err) {
      throw new ConfigurationError("Invalid JSON string for requestFieldValues");
    }

    const response = await this.createRequest({
      $,
      data: {
        serviceDeskId: this.serviceDeskId,
        requestTypeId: this.requestTypeId,
        requestFieldValues,
        requestParticipants: this.requestParticipants,
      },
    });
    $.export("$summary", "Successfully created request");
    return response;
  },
};
