import { ConfigurationError } from "@pipedream/platform";
import greenhouseJobBoardApi from "../../greenhouse_job_board_api.app.mjs";

export default {
  key: "greenhouse_job_board_api-submit-application",
  name: "Submit Application",
  description: "Submit a candidate application to a job post via `POST /{board_token}/jobs/{job_id}`. Requires a Job Board API Key (sent as Basic auth). Use **List Jobs** to find valid job post IDs. Greenhouse does not reject applications missing fields, so `first_name`, `last_name`, and `email` are validated before the call. Example: submitting `Job ID` `4001` with `First Name: Jane`, `Last Name: Doe`, `Email: jane.doe@example.com` returns `{ \"success\": \"Candidate saved successfully\" }`. [See the documentation](https://developers.greenhouse.io/job-board.html#submit-an-application).",
  version: "0.0.1",
  ai: "optimized",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    greenhouseJobBoardApi,
    jobId: {
      propDefinition: [
        greenhouseJobBoardApi,
        "jobId",
      ],
      description: "The job post ID to apply to. Use the **List Jobs** action to find valid IDs. Example: `123456`.",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The applicant's first name. Example: `Jane`.",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The applicant's last name. Example: `Doe`.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The applicant's email address. Example: `jane.doe@example.com`.",
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The applicant's phone number.",
      optional: true,
    },
    location: {
      type: "string",
      label: "Location",
      description: "The applicant's location (free-form text, e.g. `New York, NY`).",
      optional: true,
    },
    resumeText: {
      type: "string",
      label: "Resume Text",
      description: "Plain-text resume content. Alternatively provide `Resume URL`.",
      optional: true,
    },
    resumeUrl: {
      type: "string",
      label: "Resume URL",
      description: "A publicly accessible URL to the applicant's resume file. Requires `Resume URL Filename`.",
      optional: true,
    },
    resumeUrlFilename: {
      type: "string",
      label: "Resume URL Filename",
      description: "The filename for the resume referenced by `Resume URL` (e.g. `resume.pdf`).",
      optional: true,
    },
    coverLetterText: {
      type: "string",
      label: "Cover Letter Text",
      description: "Plain-text cover letter content. Alternatively provide `Cover Letter URL`.",
      optional: true,
    },
    coverLetterUrl: {
      type: "string",
      label: "Cover Letter URL",
      description: "A publicly accessible URL to the applicant's cover letter file. Requires `Cover Letter URL Filename`.",
      optional: true,
    },
    coverLetterUrlFilename: {
      type: "string",
      label: "Cover Letter URL Filename",
      description: "The filename for the cover letter referenced by `Cover Letter URL` (e.g. `cover_letter.pdf`).",
      optional: true,
    },
    mappedUrlToken: {
      type: "string",
      label: "Mapped URL Token",
      description: "The `gh_src` referral token, if applicable.",
      optional: true,
    },
    additionalFields: {
      type: "object",
      label: "Additional Fields",
      description: "Additional documented request-body fields merged into the payload, using the API's own field names. Example: `{\"question_12345\": \"Yes\", \"latitude\": \"40.7128\", \"longitude\": \"-74.0060\"}`. Use for custom question answers (`question_{id}`), `educations`, `employments`, etc.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.firstName || !this.lastName || !this.email) {
      throw new ConfigurationError("`first_name`, `last_name`, and `email` are required to submit an application.");
    }

    const response = await this.greenhouseJobBoardApi.submitApplication({
      $,
      jobId: this.jobId,
      data: {
        first_name: this.firstName,
        last_name: this.lastName,
        email: this.email,
        phone: this.phone,
        location: this.location,
        resume_text: this.resumeText,
        resume: this.resumeUrl
          ? {
            url: this.resumeUrl,
            filename: this.resumeUrlFilename,
            content_type: "application/octet-stream",
          }
          : undefined,
        cover_letter_text: this.coverLetterText,
        cover_letter: this.coverLetterUrl
          ? {
            url: this.coverLetterUrl,
            filename: this.coverLetterUrlFilename,
            content_type: "application/octet-stream",
          }
          : undefined,
        mapped_url_token: this.mappedUrlToken,
        ...this.additionalFields,
      },
    });
    $.export("$summary", `Successfully submitted application for ${this.firstName} ${this.lastName} (${this.email}) to job ${this.jobId}`);
    return response;
  },
};
