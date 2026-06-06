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
    // --- Candidate Response: primitives (optional) ---
    candidateResponseSalutation: {
      type: "string",
      label: "Candidate Response Salutation",
      description: "The candidate's salutation.",
      optional: true,
      options: [
        "mr",
        "mrs",
        "miss",
        "ms",
        "dr",
        "prof",
        "other",
      ],
    },
    candidateResponseMiddleName: {
      type: "string",
      label: "Candidate Response Middle Name",
      description: "The candidate's middle name.",
      optional: true,
    },
    candidateResponseNativeLanguageName: {
      type: "string",
      label: "Candidate Response Name in Native Language",
      description: "The candidate's name written in their native language.",
      optional: true,
    },
    candidateResponseGender: {
      type: "string",
      label: "Candidate Response Gender",
      description: "The candidate's gender.",
      optional: true,
      options: [
        "male",
        "female",
        "intersex_or_undisclosed",
      ],
    },
    candidateResponseDateOfBirth: {
      type: "string",
      label: "Candidate Response Date of Birth",
      description: "The candidate's date of birth. Format: `YYYY-MM-DD`.",
      optional: true,
    },
    candidateResponseTownOfBirth: {
      type: "string",
      label: "Candidate Response Town of Birth",
      description: "The town or city where the candidate was born.",
      optional: true,
    },
    candidateResponseStateOfBirth: {
      type: "string",
      label: "Candidate Response State of Birth",
      description: "The state or region where the candidate was born.",
      optional: true,
    },
    candidateResponseCountryOfBirth: {
      type: "string",
      label: "Candidate Response Country of Birth",
      description: "2-letter ISO country code of the candidate's country of birth (e.g., `GB`, `AU`).",
      optional: true,
    },
    candidateResponseNationalityAtBirth: {
      type: "string",
      label: "Candidate Response Nationality at Birth",
      description: "The candidate's nationality at birth (e.g., `British`).",
      optional: true,
    },
    candidateResponseMostRecentEmployer: {
      type: "string",
      label: "Candidate Response Most Recent Employer",
      description: "The name of the candidate's most recent employer.",
      optional: true,
    },
    candidateResponseEmploymentStartDate: {
      type: "string",
      label: "Candidate Response Employment Start Date",
      description: "Start date of the candidate's most recent employment. Format: `YYYY-MM-DD`.",
      optional: true,
    },
    candidateResponseEmploymentEndDate: {
      type: "string",
      label: "Candidate Response Employment End Date",
      description: "End date of the candidate's most recent employment. Format: `YYYY-MM-DD`.",
      optional: true,
    },
    // --- Candidate Response: complex/nested (optional) ---
    candidateResponseAddress: {
      type: "string",
      label: "Candidate Response Address History",
      description: "JSON array of address objects for the candidate's residence history."
        + " Each object may contain: `street_address`, `city`, `state`, `postal_code`,"
        + " `country`, `is_current_residence`, `period_residence_from`.",
      optional: true,
    },
    candidateResponseEmploymentHistory: {
      type: "string",
      label: "Candidate Response Employment History",
      description: "JSON array of employment objects matching the Veremark API schema."
        + " Each object may contain: `organisation_name`, `manager`,"
        + " `employment_period_from`, `employment_period_to`, `candidate_job_title`.",
      optional: true,
    },
    candidateResponseEducation: {
      type: "string",
      label: "Candidate Response Education",
      description: "JSON object representing the candidate's education history."
        + " Fields: `institution_name`, `institution_address`, `grade_obtained`,"
        + " `start_date_attended`, `end_date_attended`, `date_of_qualification`.",
      optional: true,
    },
    candidateResponsePassportDetails: {
      type: "object",
      label: "Candidate Response Passport Details",
      description: "Passport details for the candidate."
        + " Fields: `passport_number`, `passport_issue_country`,"
        + " `passport_issue_date`, `is_current_passport`.",
      optional: true,
    },
    candidateResponseNationalIdDetails: {
      type: "object",
      label: "Candidate Response National ID Details",
      description: "National ID details for the candidate. Fields: `national_id_type`, `national_id_number`.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.jobAdditionalInformation?.length > 32) {
      throw new Error(`Job Additional Information must be 32 characters or fewer (currently ${this.jobAdditionalInformation.length}).`);
    }

    const parseJson = (val, fieldName) => {
      if (!val) return undefined;
      if (typeof val === "object") return val;
      try {
        return JSON.parse(val);
      } catch {
        throw new Error(`${fieldName} must be valid JSON.`);
      }
    };

    const detail = {
      ...(this.candidateResponseSalutation && {
        salutation: this.candidateResponseSalutation,
      }),
      ...(this.candidateResponseMiddleName && {
        middle_name: this.candidateResponseMiddleName,
      }),
      ...(this.candidateResponseNativeLanguageName && {
        native_language_name: this.candidateResponseNativeLanguageName,
      }),
      ...(this.candidateResponseGender && {
        gender: this.candidateResponseGender,
      }),
      ...(this.candidateResponseDateOfBirth && {
        date_of_birth: this.candidateResponseDateOfBirth,
      }),
      ...(this.candidateResponseTownOfBirth && {
        town_of_birth: this.candidateResponseTownOfBirth,
      }),
      ...(this.candidateResponseStateOfBirth && {
        state_of_birth: this.candidateResponseStateOfBirth,
      }),
      ...(this.candidateResponseCountryOfBirth && {
        country_of_birth: this.candidateResponseCountryOfBirth,
      }),
      ...(this.candidateResponseNationalityAtBirth && {
        nationality_at_birth: this.candidateResponseNationalityAtBirth,
      }),
      ...(this.candidateResponseMostRecentEmployer && {
        most_recent_employer: this.candidateResponseMostRecentEmployer,
      }),
      ...(this.candidateResponseEmploymentStartDate && {
        employment_start_date: this.candidateResponseEmploymentStartDate,
      }),
      ...(this.candidateResponseEmploymentEndDate && {
        employment_end_date: this.candidateResponseEmploymentEndDate,
      }),
    };

    const parsedAddress = parseJson(
      this.candidateResponseAddress,
      "Candidate Response Address",
    );
    const parsedEmployment = parseJson(
      this.candidateResponseEmploymentHistory,
      "Candidate Response Employment History",
    );
    const parsedEducation = parseJson(
      this.candidateResponseEducation,
      "Candidate Response Education",
    );

    const candidateResponse = {
      ...(Object.keys(detail).length > 0 && {
        detail,
      }),
      ...(parsedAddress && {
        address: parsedAddress,
      }),
      ...(parsedEmployment && {
        employment: parsedEmployment,
      }),
      ...(parsedEducation && {
        education: parsedEducation,
      }),
      ...(this.candidateResponsePassportDetails && {
        passport_details: this.candidateResponsePassportDetails,
      }),
      ...(this.candidateResponseNationalIdDetails && {
        national_id_details: this.candidateResponseNationalIdDetails,
      }),
    };

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
        external_id: this.jobExternalId,
        client: this.jobClient,
        additional_information: this.jobAdditionalInformation,
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
      send_initial_candidate_email: this.sendInitialCandidateEmail,
      assigned_user_guid: this.assignedUserGuid,
      ...(Object.keys(candidateResponse).length > 0 && {
        candidate_response: candidateResponse,
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
