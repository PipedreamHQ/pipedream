import jobber from "../../jobber.app.mjs";
import { ConfigurationError } from "@pipedream/platform";
import moment from "moment-timezone";

const ISO_8601_REGEX = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?)?$/;

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

      return {
        date: iso8601Date,
        time: iso8601Time,
        timezone,
      };
    },
  },
  async run({ $ }) {
    if (!ISO_8601_REGEX.test(this.startAt) || isNaN(new Date(this.startAt).getTime())) {
      throw new ConfigurationError("Start At is not a valid ISO 8601 date.");
    }
    if (!ISO_8601_REGEX.test(this.endAt) || isNaN(new Date(this.endAt).getTime())) {
      throw new ConfigurationError("End At is not a valid ISO 8601 date.");
    }
    if (new Date(this.endAt) <= new Date(this.startAt)) {
      throw new ConfigurationError("End At must be after Start At.");
    }
    const {
      jobId,
      title,
      instructions,
    } = this;

    const visit = {
      schedule: {
        startAt: this.extractDateTimeAttributes(this.startAt),
        endAt: this.extractDateTimeAttributes(this.endAt),
      },
    };
    if (title) {
      visit.title = title;
    }
    if (instructions) {
      visit.instructions = instructions;
    }

    const response = await this.jobber.post({
      $,
      data: {
        query: `mutation CreateVisit($jobId: EncodedId!, $input: VisitCreateInput!) {
          visitCreate(jobId: $jobId, input: $input) {
            createdVisits {
              id
              title
            }
            userErrors {
              message
            }
          }
        }`,
        variables: {
          jobId,
          input: {
            visits: [
              visit,
            ],
          },
        },
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
    const id = response.data?.visitCreate?.createdVisits?.[0]?.id;
    $.export("$summary", `Successfully scheduled visit${id
      ? ` with ID ${id}`
      : ""} on job ${jobId}`);
    return response;
  },
};
