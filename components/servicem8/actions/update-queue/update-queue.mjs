import servicem8 from "../../servicem8.app.mjs";
import {
  optionalBool01,
  optionalParsedInt,
  semicolonDelimitedUuidsForApi,
} from "../../common/payload.mjs";

export default {
  key: "servicem8-update-queue",
  name: "Update Job Queue",
  description: "Update a job queue (loads the record, merges your fields, then POSTs). [See the documentation](https://developer.servicem8.com/reference/updatejobqueues)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    servicem8,
    uuid: {
      type: "string",
      useQuery: true,
      async options({
        $, prevContext, query,
      }) {
        return this.servicem8._uuidOptionsForResource({
          $: $ ?? this,
          resource: "queue",
          prevContext,
          query,
        });
      },
      label: "Queue to update",
      description: "Queue record to load, merge, and save (search or paste UUID).",
    },
    name: {
      type: "string",
      label: "Name",
      optional: true,
      description: "Queue name (e.g. Workshop, Pending Quotes).",
    },
    defaultTimeframe: {
      type: "string",
      label: "Default Timeframe (days)",
      optional: true,
      description: "Default days jobs stay in this queue before needing attention (e.g. 7 or 14).",
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
      label: "Requires Assignment",
      optional: true,
      description: "When true, jobs must be assigned; when false, visible to all staff (sent as 0 or 1).",
    },
  },
  async run({ $ }) {
    const response = await this.servicem8.updateQueue({
      $,
      uuid: this.uuid,
      data: {
        name: this.name,
        default_timeframe: optionalParsedInt(this.defaultTimeframe),
        subscribed_staff: semicolonDelimitedUuidsForApi(this.subscribedStaff),
        requires_assignment: optionalBool01(this.requiresAssignment),
      },
    });
    $.export("$summary", `Updated Queue ${this.uuid}`);
    return response;
  },
};
