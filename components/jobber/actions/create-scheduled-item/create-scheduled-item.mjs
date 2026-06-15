import jobber from "../../jobber.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "jobber-create-scheduled-item",
  name: "Create Scheduled Item",
  description: "Schedules a new visit on a job within Jobber. Visits are the schedulable items that appear on the Jobber calendar. [See the documentation](https://developer.getjobber.com/docs/)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    jobber,
    jobId: {
      type: "string",
      label: "Job ID",
      description: "The ID of the job to schedule the visit on. Use the **List Jobs** action to find a job's ID.",
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title of the visit",
      optional: true,
    },
    startAt: {
      type: "string",
      label: "Start At",
      description: "The scheduled start time in ISO 8601 format (e.g. `2026-06-15T09:00:00Z`)",
    },
    endAt: {
      type: "string",
      label: "End At",
      description: "The scheduled end time in ISO 8601 format (e.g. `2026-06-15T10:00:00Z`)",
    },
  },
  async run({ $ }) {
    const {
      jobId,
      title,
      startAt,
      endAt,
    } = this;

    const input = [
      `jobId: "${jobId}"`,
      title && `title: "${title}"`,
      `startAt: "${startAt}"`,
      `endAt: "${endAt}"`,
    ].filter(Boolean).join(", ");

    const response = await this.jobber.post({
      $,
      data: {
        query: `mutation CreateVisit {
          visitCreate(input: {${input}}) {
            visit {
              id
              title
              startAt
              endAt
            }
            userErrors {
              message
            }
          }
        }`,
        operationName: "CreateVisit",
      },
    });
    if (response.errors) {
      throw new Error(response.errors[0].message);
    }
    const userErrors = response.data?.visitCreate?.userErrors;
    if (userErrors?.length) {
      throw new ConfigurationError(userErrors[0].message);
    }
    $.export("$summary", `Successfully scheduled visit with ID ${response.data.visitCreate.visit.id}`);
    return response;
  },
};
