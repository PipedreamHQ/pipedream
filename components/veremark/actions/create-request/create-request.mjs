import app from "../../veremark.app.mjs";

export default {
  key: "veremark-create-request",
  name: "Create Background Check Request",
  description:
    "Initiates a new background check request for a candidate."
    + " Veremark sends the candidate an email invitation to complete their part of the screening process."
    + " Returns the request GUID — save this to check status later with **Get Background Check Request**."
    + " Use **List Criteria** first to find the criteria GUID for the background check package you want to run."
    + " The webhook URL is optional; if omitted you can poll status via **Get Background Check Request**."
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
    jobTitle: {
      type: "string",
      label: "Job Title / Role",
      description: "The role the candidate is applying for. Example: `Software Engineer`.",
    },
    webhookUrl: {
      type: "string",
      label: "Webhook URL",
      description: "Optional URL to receive a POST notification when the request status changes. If omitted, poll status with **Get Background Check Request**.",
      optional: true,
    },
    webhookMethod: {
      type: "string",
      label: "Webhook Method",
      description: "HTTP method for the webhook. Defaults to `POST`.",
      optional: true,
      default: "POST",
      options: [
        "POST",
        "PUT",
        "PATCH",
      ],
    },
  },
  async run({ $ }) {
    const data = {
      candidate: {
        first_name: this.candidateFirstName,
        last_name: this.candidateLastName,
        email: this.candidateEmail,
      },
      job: {
        title: this.jobTitle,
        criteria: this.criteriaGuid,
      },
      webhook: {
        url: this.webhookUrl || "",
        method: this.webhookMethod || "POST",
      },
    };

    let response;
    try {
      response = await this.app.createRequest({
        $,
        data,
      });
    } catch (err) {
      const status = err?.response?.status;
      const body = err?.response?.data;
      const detail = body?.detail || body?.message || JSON.stringify(body) || err.message;
      const msg = status >= 500
        ? `Veremark server error (HTTP ${status}): ${detail}. This may be a temporary issue — please try again.`
        : status === 400
          ? `Invalid request (HTTP 400): ${detail}. Check the criteria GUID and candidate fields.`
          : status === 403
            ? "Access denied. Check your API token and account permissions."
            : `Failed to create request (HTTP ${status ?? "unknown"}): ${detail}`;
      $.export("$summary", msg);
      return {
        error: msg,
        attempted: {
          candidateEmail: this.candidateEmail,
          criteriaGuid: this.criteriaGuid,
          jobTitle: this.jobTitle,
        },
      };
    }

    $.export("$summary", `Created background check request for ${this.candidateFirstName} ${this.candidateLastName} — GUID: ${response.guid ?? response.id ?? "see response"}`);
    return response;
  },
};
