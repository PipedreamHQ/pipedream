import app from "../../veremark.app.mjs";

export default {
  key: "veremark-create-request",
  name: "Create Background Check Request",
  description:
    "Initiates a new background check request for a candidate."
    + " Veremark sends the candidate an email invitation to complete their part of the screening process."
    + " Returns the request GUID — save this to check status later with **Get Background Check Request**."
    + " Use **List Criteria** first to find the criteria GUID for the background check package you want to run."
    + " [See the documentation](https://api.veremark.com/external/v1/docs/#tag/request/operation/createRequest)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    criteriaGuid: {
      propDefinition: [
        app,
        "criteriaGuid",
      ],
    },
    candidateFirstName: {
      type: "string",
      label: "Candidate First Name",
      description: "The candidate's first name.",
    },
    candidateLastName: {
      type: "string",
      label: "Candidate Last Name",
      description: "The candidate's last name.",
    },
    candidateEmail: {
      type: "string",
      label: "Candidate Email",
      description: "The candidate's email address. Veremark will send the screening invitation here.",
    },
    jobRole: {
      type: "string",
      label: "Job Role",
      description: "The role the candidate is applying for. Example: `Software Engineer`.",
    },
    webhookUrl: {
      type: "string",
      label: "Webhook URL",
      description: "URL to receive a notification when the request status changes.",
    },
    webhookMethod: {
      type: "string",
      label: "Webhook Method",
      description: "HTTP method Veremark will use when calling the webhook URL.",
      default: "POST",
      options: [
        "POST",
        "PUT",
        "PATCH",
        "GET",
      ],
    },
  },
  async run({ $ }) {
    const data = {
      criteria_guid: this.criteriaGuid,
      candidate: {
        first_name: this.candidateFirstName,
        last_name: this.candidateLastName,
        email: this.candidateEmail,
      },
      job: {
        role: this.jobRole,
      },
      webhook: {
        url: this.webhookUrl,
        method: this.webhookMethod,
      },
    };

    const response = await this.app.createRequest({
      $,
      data,
    });

    $.export("$summary", `Created background check request for ${this.candidateFirstName} ${this.candidateLastName} — GUID: ${response.guid ?? response.id ?? "see response"}`);
    return response;
  },
};
