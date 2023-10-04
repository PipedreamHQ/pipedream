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
    cloudId: {
      propDefinition: [
        jiraServiceDesk,
        "cloudId",
      ],
    },
    serviceDeskId: {
      propDefinition: [
        jiraServiceDesk,
        "serviceDeskId",
        ({ cloudId }) => ({
          cloudId,
        }),
      ],
    },
    requestTypeId: {
      propDefinition: [
        jiraServiceDesk,
        "requestTypeId",
        ({
          cloudId, serviceDeskId,
        }) => ({
          cloudId,
          serviceDeskId,
        }),
      ],
    },
    summary: {
      type: "string",
      label: "Summary",
      description: "Summary of the request (a single line of text).",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the request (multiple lines of text separated by `\\n`).",
    },
    requestFieldValues: {
      type: "string",
      label: "Request Field Values",
      description:
        "Additional values for the fields of the request. This should be a JSON-stringified object. [See the documentation here.](https://docs.atlassian.com/jira-servicedesk/REST/3.6.2/#fieldformats)",
      optional: true,
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
    const {
      cloudId,
      serviceDeskId,
      requestTypeId,
      summary,
      description,
      requestParticipants,
    } = this;
    let requestFieldValues;
    if (this.requestFieldValues) {
      try {
        requestFieldValues = JSON.parse(this.requestFieldValues);
      } catch (err) {
        throw new ConfigurationError("Invalid JSON string for requestFieldValues");
      }
    }

    const response = await this.jiraServiceDesk.createCustomerRequest({
      $,
      cloudId,
      data: {
        serviceDeskId,
        requestTypeId,
        requestFieldValues: {
          summary,
          description,
          ...requestFieldValues,
        },
        requestParticipants,
      },
    });
    $.export("$summary", "Successfully created request");
    return response;
  },
};
