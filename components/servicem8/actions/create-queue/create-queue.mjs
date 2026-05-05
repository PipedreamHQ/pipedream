import servicem8 from "../../servicem8.app.mjs";
import {
  optionalBool01,
  optionalParsedInt,
  semicolonDelimitedUuidsForApi,
} from "../../common/payload.mjs";

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
      description: "Queue name (e.g. Workshop, Pending Quotes).",
    },
    defaultTimeframe: {
      type: "integer",
      label: "Default Timeframe (days)",
      optional: true,
      description:
        "Default days jobs stay in this queue before needing attention (e.g. 7 or 14).",
    },
    subscribedStaff: {
      type: "string[]",
      label: "Subscribed staff",
      optional: true,
      useQuery: true,
      async options({
        $, prevContext, query,
      }) {
        return this.servicem8._uuidOptionsForResource({
          $: $ ?? this,
          resource: "staff",
          prevContext,
          query,
        });
      },
      description:
        "Staff UUIDs subscribed to notifications for this queue (`subscribed_staff`). Sent as a semicolon-delimited string.",
    },
    requiresAssignment: {
      type: "boolean",
      label: "Requires assignment",
      optional: true,
      description:
        "If enabled, jobs must be assigned to staff; otherwise jobs are visible to all staff (`requires_assignment`).",
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
        subscribed_staff: semicolonDelimitedUuidsForApi(this.subscribedStaff),
        requires_assignment: optionalBool01(this.requiresAssignment),
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
