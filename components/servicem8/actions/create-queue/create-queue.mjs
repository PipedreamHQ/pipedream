import servicem8 from "../../servicem8.app.mjs";
import { optionalParsedInt } from "../../common/payload.mjs";

export default {
  key: "servicem8-create-queue",
  name: "Create Job Queue",
  description: "Create a job queue. [See the documentation](https://developer.servicem8.com/reference/createjobqueues)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    servicem8,
    name: {
      type: "string",
      label: "Name",
      description:
        "Queue name (e.g. Workshop, Pending Quotes).",
    },
    defaultTimeframe: {
      type: "string",
      label: "Default Timeframe (days)",
      optional: true,
      description:
        "Default days jobs stay in this queue before needing attention (e.g. 7 or 14).",
    },
    subscribedStaff: {
      type: "string",
      label: "Subscribed Staff",
      optional: true,
      description:
        "Semicolon-separated staff UUIDs subscribed to notifications for this queue.",
    },
    requiresAssignment: {
      type: "string",
      label: "Requires Assignment",
      optional: true,
      description: "0 = visible to all staff; 1 = jobs must be assigned.",
    },
  },
  async run({ $ }) {
    const {
      body, recordUuid,
    } = await this.servicem8.createQueue({
      $,
      data: {
        name: this.name,
        default_timeframe: optionalParsedInt(this.defaultTimeframe),
        subscribed_staff: this.subscribedStaff,
        requires_assignment: optionalParsedInt(this.requiresAssignment),
      },
    });
    $.export("$summary", `Created Job Queue${recordUuid
      ? ` (${recordUuid})`
      : ""}`);
    return {
      body,
      recordUuid,
    };
  },
};
