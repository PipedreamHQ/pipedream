import jobber from "../../jobber.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "jobber-create-job",
  name: "Create Job",
  description: "Creates a new job for a property within Jobber. [See the documentation](https://developer.getjobber.com/docs/)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    jobber,
    clientId: {
      propDefinition: [
        jobber,
        "clientId",
      ],
      description: "The client to scope the property list to. Not sent to Jobber - used only to filter the **Property** options.",
      optional: true,
    },
    propertyId: {
      propDefinition: [
        jobber,
        "propertyId",
        ({ clientId }) => ({
          clientId,
        }),
      ],
      description: "The property the job is for. The job's client is derived from this property.",
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title of the job",
      optional: true,
    },
    instructions: {
      type: "string",
      label: "Instructions",
      description: "Instructions for the job",
      optional: true,
    },
    invoicingType: {
      type: "string",
      label: "Invoicing Type",
      description: "How the job is billed",
      options: [
        "FIXED_PRICE",
        "VISIT_BASED",
      ],
    },
    invoicingSchedule: {
      type: "string",
      label: "Invoicing Schedule",
      description: "When the job is invoiced",
      options: [
        "ON_COMPLETION",
        "PERIODIC",
        "PER_VISIT",
        "NEVER",
      ],
    },
  },
  async run({ $ }) {
    const {
      propertyId,
      title,
      instructions,
      invoicingType,
      invoicingSchedule,
    } = this;

    const input = [
      `propertyId: "${propertyId}"`,
      title && `title: "${title}"`,
      instructions && `instructions: "${instructions}"`,
      `invoicing: {invoicingType: ${invoicingType}, invoicingSchedule: ${invoicingSchedule}}`,
    ].filter(Boolean).join(", ");

    const response = await this.jobber.post({
      $,
      data: {
        query: `mutation CreateJob {
          jobCreate(input: {${input}}) {
            job {
              id
              jobNumber
              title
            }
            userErrors {
              message
            }
          }
        }`,
        operationName: "CreateJob",
      },
    });
    if (response.errors) {
      throw new Error(response.errors[0].message);
    }
    const userErrors = response.data?.jobCreate?.userErrors;
    if (userErrors?.length) {
      throw new ConfigurationError(userErrors[0].message);
    }
    $.export("$summary", `Successfully created job with ID ${response.data.jobCreate.job.id}`);
    return response;
  },
};
