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
    // --- Candidate (required) ---
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
    // --- Candidate (optional) ---
    candidateCountryCode: {
      type: "string",
      label: "Candidate Country Code",
      description: "The candidate's country code (e.g. `GB`, `US`).",
      optional: true,
    },
    candidatePhoneNumber: {
      type: "string",
      label: "Candidate Phone Number",
      description: "The candidate's phone number.",
      optional: true,
    },
    // --- Job (required) ---
    jobRole: {
      type: "string",
      label: "Job Role",
      description: "The role the candidate is applying for. Example: `Software Engineer`.",
    },
    // --- Job (optional) ---
    jobExternalId: {
      type: "string",
      label: "Job External ID",
      description: "An external reference ID for the job, used to correlate requests with your own system.",
      optional: true,
    },
    jobClient: {
      type: "string",
      label: "Job Client",
      description: "The client or organisation associated with this job.",
      optional: true,
    },
    jobAdditionalInformation: {
      type: "string",
      label: "Job Additional Information",
      description: "Additional context for the background check. Maximum 32 characters.",
      optional: true,
    },
    // --- Webhook (required) ---
    webhookUrl: {
      type: "string",
      label: "Webhook URL",
      description: "URL to receive a notification when the request status changes.",
    },
    webhookMethod: {
      type: "string",
      label: "Webhook Method",
      description: "HTTP method Veremark will use when calling the webhook URL.",
      default: "post",
      options: [
        "post",
        "put",
        "patch",
        "get",
      ],
    },
    // --- Top-level optional ---
    sendInitialCandidateEmail: {
      type: "boolean",
      label: "Send Initial Candidate Email",
      description: "Whether Veremark sends the initial invitation email to the candidate. Defaults to `true`.",
      optional: true,
      default: true,
    },
    assignedUserGuid: {
      type: "string",
      label: "Assigned User GUID",
      description: "UUID of the Veremark user to assign this request to.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.jobAdditionalInformation?.length > 32) {
      throw new Error(`Job Additional Information must be 32 characters or fewer (currently ${this.jobAdditionalInformation.length}).`);
    }

    const data = {
      criteria_guid: this.criteriaGuid,
      candidate: {
        first_name: this.candidateFirstName,
        last_name: this.candidateLastName,
        email: this.candidateEmail,
        ...(this.candidateCountryCode && {
          country_code: this.candidateCountryCode,
        }),
        ...(this.candidatePhoneNumber && {
          phone_number: this.candidatePhoneNumber,
        }),
      },
      job: {
        role: this.jobRole,
        ...(this.jobExternalId && {
          external_id: this.jobExternalId,
        }),
        ...(this.jobClient && {
          client: this.jobClient,
        }),
        ...(this.jobAdditionalInformation && {
          additional_information: this.jobAdditionalInformation,
        }),
      },
      webhook: {
        url: this.webhookUrl,
        method: this.webhookMethod,
      },
      ...(this.sendInitialCandidateEmail !== undefined && {
        send_initial_candidate_email: this.sendInitialCandidateEmail,
      }),
      ...(this.assignedUserGuid && {
        assigned_user_guid: this.assignedUserGuid,
      }),
    };

    const response = await this.app.createRequest({
      $,
      data,
    });

    $.export("$summary", `Created background check request for ${this.candidateFirstName} ${this.candidateLastName} — GUID: ${response.guid ?? response.id ?? "see response"}`);
    return response;
  },
};
