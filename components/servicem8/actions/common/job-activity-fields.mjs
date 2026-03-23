import {
  optionalBool10String,
  optionalParsedInt,
} from "../../common/payload.mjs";
import { allOptional } from "../../common/action-schema.mjs";

/**
 * ServiceM8 job activity create/update body fields.
 * Aligned with [Create job activities](https://developer.servicem8.com/reference/createjobactivities)
 * and [Update job activities](https://developer.servicem8.com/reference/updatejobactivities).
 */
export const jobActivityCreateFields = [
  {
    prop: "jobUuid",
    api: "job_uuid",
    propDefinition: "jobUuid",
    description: "The UUID of the job this activity belongs to",
  },
  {
    prop: "staffUuid",
    api: "staff_uuid",
    propDefinition: "staffUuid",
    optional: true,
    description: "The UUID of the staff member assigned to this activity",
  },
  {
    prop: "startDate",
    api: "start_date",
    type: "string",
    label: "Start Date",
    optional: true,
    description: "Scheduled start date and time of the activity",
  },
  {
    prop: "endDate",
    api: "end_date",
    type: "string",
    label: "End Date",
    optional: true,
    description: "Scheduled end date and time of the activity",
  },
  {
    prop: "activityWasScheduled",
    api: "activity_was_scheduled",
    type: "boolean",
    label: "Activity Was Scheduled",
    optional: true,
    description:
      "Scheduled in advance; cannot be true if Activity Was Recorded is true. Sends `\"1\"` / `\"0\"`.",
    transform: optionalBool10String,
  },
  {
    prop: "activityWasRecorded",
    api: "activity_was_recorded",
    type: "boolean",
    label: "Activity Was Recorded",
    optional: true,
    description:
      "Recorded after completion, not scheduled ahead; cannot be true if Activity Was Scheduled is true. Sends `\"1\"` / `\"0\"`.",
    transform: optionalBool10String,
  },
  {
    prop: "activityWasAutomated",
    api: "activity_was_automated",
    type: "string",
    label: "Activity Was Automated",
    optional: true,
    description: "Integer flag (e.g. 0) for automated activities",
    transform: optionalParsedInt,
  },
  {
    prop: "hasBeenOpened",
    api: "has_been_opened",
    type: "boolean",
    label: "Has Been Opened",
    optional: true,
    description:
      "Whether assigned staff has viewed this activity; relevant when scheduled. Sends `\"1\"` / `\"0\"`.",
    transform: optionalBool10String,
  },
  {
    prop: "hasBeenOpenedTimestamp",
    api: "has_been_opened_timestamp",
    type: "string",
    label: "Has Been Opened Timestamp",
    optional: true,
    description: "When staff first viewed the activity (`YYYY-MM-DD HH:MM:SS`)",
  },
  {
    prop: "travelTimeInSeconds",
    api: "travel_time_in_seconds",
    type: "string",
    label: "Travel Time (seconds)",
    optional: true,
    description: "Estimated travel time to the activity location, in seconds",
    transform: optionalParsedInt,
  },
  {
    prop: "travelDistanceInMeters",
    api: "travel_distance_in_meters",
    type: "string",
    label: "Travel Distance (meters)",
    optional: true,
    description: "Estimated travel distance to the activity location, in meters",
    transform: optionalParsedInt,
  },
  {
    prop: "allocatedByStaffUuid",
    api: "allocated_by_staff_uuid",
    type: "string",
    label: "Allocated By Staff UUID",
    optional: true,
    description: "Deprecated in the API",
  },
  {
    prop: "allocatedTimestamp",
    api: "allocated_timestamp",
    type: "string",
    label: "Allocated Timestamp",
    optional: true,
    description: "Deprecated in the API",
  },
  {
    prop: "materialUuid",
    api: "material_uuid",
    propDefinition: "jobmaterialUuid",
    optional: true,
    description:
      "Job material UUID used to determine activity cost",
  },
];

export const jobActivityUpdateFields = allOptional(jobActivityCreateFields);
