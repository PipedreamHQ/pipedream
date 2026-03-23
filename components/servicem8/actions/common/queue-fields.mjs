import { allOptional } from "../../common/action-schema.mjs";
import { optionalParsedInt } from "../../common/payload.mjs";

/**
 * ServiceM8 job queue create/update body fields.
 * Aligned with [Create job queues](https://developer.servicem8.com/reference/createjobqueues)
 * and [Update job queues](https://developer.servicem8.com/reference/updatejobqueues).
 */
export const queueCreateFields = [
  {
    prop: "name",
    api: "name",
    type: "string",
    label: "Name",
    description:
      "Queue name (e.g. Workshop, Pending Quotes).",
  },
  {
    prop: "defaultTimeframe",
    api: "default_timeframe",
    type: "string",
    label: "Default Timeframe (days)",
    optional: true,
    description:
      "Default days jobs stay in this queue before needing attention (e.g. 7 or 14).",
    transform: optionalParsedInt,
  },
  {
    prop: "subscribedStaff",
    api: "subscribed_staff",
    type: "string",
    label: "Subscribed Staff",
    optional: true,
    description:
      "Semicolon-separated staff UUIDs subscribed to notifications for this queue.",
  },
  {
    prop: "requiresAssignment",
    api: "requires_assignment",
    type: "string",
    label: "Requires Assignment",
    optional: true,
    description: "0 = visible to all staff; 1 = jobs must be assigned.",
    transform: optionalParsedInt,
  },
];

export const queueUpdateFields = allOptional(queueCreateFields);
