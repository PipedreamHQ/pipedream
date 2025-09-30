import jobber from "../../jobber.app.mjs";
import { ConfigurationError } from "@pipedream/platform";
import moment from "moment-timezone";

export default {
  key: "jobber-create-request",
  name: "Create Service Request",
  description: "Creates a new service request for a client's first property within Jobber. [See the documentation](https://developer.getjobber.com/docs/)",
  version: "0.0.4",
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
    title: {
      type: "string",
      label: "Title",
      description: "Title of the request",
    },
    instructions: {
      type: "string",
      label: "Instructions",
      description: "The instructions for the assessment",
      optional: true,
    },
    startAt: {
      type: "string",
      label: "Start At",
      description: "The scheduled start time in ISO 8601 format.",
      optional: true,
    },
    endAt: {
      type: "string",
      label: "End At",
      description: "The scheduled end time in ISO 8601 format.",
      optional: true,
    },
  },
  methods: {
    extractDateTimeAttributes(isoDateString) {
      const date = new Date(isoDateString);

      // Extract date
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString()
        .padStart(2, "0");
      const iso8601Date = `${year}-${month}-${day}`;

      // Extract time
      const hours = date.getHours().toString()
        .padStart(2, "0");
      const minutes = date.getMinutes().toString()
        .padStart(2, "0");
      const seconds = date.getSeconds().toString()
        .padStart(2, "0");
      const iso8601Time = `${hours}:${minutes}:${seconds}`;

      // Extract timezone
      const timezone = moment.tz.guess(true);

      return `{date: "${iso8601Date}", time: "${iso8601Time}", timezone: "${timezone}"}`;
    },
  },
  async run({ $ }) {
    if ((this.startAt && !this.endAt) || (!this.startAt && this.endAt)) {
      throw new ConfigurationError("Both Start At and End At should be provided.");
    }
    const {
      clientId,
      title,
      instructions = "",
    } = this;

    let schedule = "";
    if (this.startAt && this.endAt) {
      const startAt = this.extractDateTimeAttributes(this.startAt);
      const endAt = this.extractDateTimeAttributes(this.endAt);
      schedule = `, schedule: {startAt: ${startAt}, endAt: ${endAt}}`;
    }
    const assessment = `{instructions: "${instructions}"${schedule}}`;

    const response = await this.jobber.post({
      $,
      data: {
        query: `mutation CreateRequest {
          requestCreate(
            input: {title: "${title}", clientId: "${clientId}", assessment: ${assessment}}
          ) {
            request {
              id
              title,
              client {
                id
              }
            }
          }
        }`,
        operationName: "CreateRequest",
      },
    });
    if (response.errors) {
      throw new Error(response.errors[0].message);
    }
    $.export("$summary", `Successfully created service request for client ${clientId}.`);
    return response;
  },
};
