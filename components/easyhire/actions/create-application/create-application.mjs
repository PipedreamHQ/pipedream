import easyhire from "../../easyhire.app.mjs";

export default {
  key: "easyhire-create-application",
  name: "Create Application",
  description: "Creates a new application in EasyHire. [See the documentation](https://easyhire.ai/integrations/api-docs/)",
  version: "0.0.1",
  type: "action",
  props: {
    easyhire,
    jobOpeningId: {
      type: "string",
      label: "Job Opening ID",
      description: "The ID of the job opening to create the application for",
    },
    applicantEmail: {
      type: "string",
      label: "Applicant Email",
      description: "The email address of the applicant",
    },
    applicantName: {
      type: "string",
      label: "Applicant Name",
      description: "The name of the applicant",
    },
    resumePdf: {
      type: "string",
      label: "Resume PDF",
      description: "The URL of a .pdf file containing the applicant's resume",
    },
    uniqueExternalId: {
      type: "string",
      label: "Unique External ID",
      description: "A unique external ID representing the application",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.easyhire.createApplication({
      $,
      data: {
        job_opening_id: this.jobOpeningId,
        applicant_email: this.applicantEmail,
        applicant_name: this.applicantName,
        resume_pdf: this.resumePdf,
        unique_external_id: this.uniqueExternalId,
      },
    });
    $.export("$summary", `Successfully created application for ${this.applicantName}`);
    return response;
  },
};
