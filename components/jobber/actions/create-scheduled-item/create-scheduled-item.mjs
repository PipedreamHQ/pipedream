import jobber from "../../jobber.app.mjs";
import { ConfigurationError } from "@pipedream/platform";
import moment from "moment-timezone";

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
      propDefinition: [
        jobber,
        "jobId",
      ],
      description: "The job to schedule the visit on",
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title of the visit",
      optional: true,
    },
    instructions: {
      type: "string",
      label: "Instructions",
      description: "Instructions for the visit",
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
  methods: {
    extractDateTimeAttributes(isoDateString) {
      const date = new Date(isoDateString);

      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString()
        .padStart(2, "0");
      const iso8601Date = `${year}-${month}-${day}`;

      const hours = date.getHours().toString()
        .padStart(2, "0");
      const minutes = date.getMinutes().toString()
        .padStart(2, "0");
      const seconds = date.getSeconds().toString()
        .padStart(2, "0");
      const iso8601Time = `${hours}:${minutes}:${seconds}`;

      const timezone = moment.tz.guess(true);

      return `{date: "${iso8601Date}", time: "${iso8601Time}", timezone: "${timezone}"}`;
    },
  },
  async run({ $ }) {
    if (new Date(this.endAt) <= new Date(this.startAt)) {
      throw new ConfigurationError("End At must be after Start At.");
    }
    const {
      jobId,
      title,
      instructions,
    } = this;

    const startAt = this.extractDateTimeAttributes(this.startAt);
    const endAt = this.extractDateTimeAttributes(this.endAt);

    const visit = [
      title && `title: "${title}"`,
      instructions && `instructions: "${instructions}"`,
      `schedule: {startAt: ${startAt}, endAt: ${endAt}}`,
    ].filter(Boolean).join(", ");

    const response = await this.jobber.post({
      $,
      data: {
        query: `mutation CreateVisit {
          visitCreate(jobId: "${jobId}", input: {visits: [{${visit}}]}) {
            visits {
              id
              title
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
    const id = response.data?.visitCreate?.visits?.[0]?.id;
    $.export("$summary", `Successfully scheduled visit${id
      ? ` with ID ${id}`
      : ""} on job ${jobId}`);
    return response;
  },
};
