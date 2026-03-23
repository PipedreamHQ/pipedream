import { optionalBool01 } from "../../common/payload.mjs";
import { allOptional } from "../../common/action-schema.mjs";

export const jobActivityCreateFields = [
  {
    prop: "jobUuid",
    api: "job_uuid",
    propDefinition: "jobUuid",
  },
  {
    prop: "staffUuid",
    api: "staff_uuid",
    propDefinition: "staffUuid",
    optional: true,
  },
  {
    prop: "startDate",
    api: "start_date",
    type: "string",
    label: "Start Date",
    optional: true,
  },
  {
    prop: "endDate",
    api: "end_date",
    type: "string",
    label: "End Date",
    optional: true,
  },
  {
    prop: "startTime",
    api: "start_time",
    type: "string",
    label: "Start Time",
    optional: true,
  },
  {
    prop: "endTime",
    api: "end_time",
    type: "string",
    label: "End Time",
    optional: true,
  },
  {
    prop: "description",
    api: "description",
    type: "string",
    label: "Description",
    optional: true,
  },
  {
    prop: "notes",
    api: "notes",
    type: "string",
    label: "Notes",
    optional: true,
  },
  {
    prop: "activityWasScheduled",
    api: "activity_was_scheduled",
    type: "boolean",
    label: "Activity Was Scheduled",
    optional: true,
    description: "When set, sends 1 (scheduled booking) or 0 (time entry)",
    transform: optionalBool01,
  },
];

export const jobActivityUpdateFields = allOptional(jobActivityCreateFields);
