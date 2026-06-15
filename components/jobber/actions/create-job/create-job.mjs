import jobber from "../../jobber.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "jobber-create-job",
  name: "Create Job",
  description: "Creates a new job within Jobber. [See the documentation](https://developer.getjobber.com/docs/)",
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
    },
    propertyId: {
      propDefinition: [
        jobber,
        "propertyId",
        ({ clientId }) => ({
          clientId,
        }),
      ],
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title of the job",
    },
    instructions: {
      type: "string",
      label: "Instructions",
      description: "Instructions for the job",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      clientId,
      propertyId,
      title,
      instructions,
    } = this;

    const input = [
      `clientId: "${clientId}"`,
      `title: "${title}"`,
      propertyId && `propertyId: "${propertyId}"`,
      instructions && `instructions: "${instructions}"`,
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
