import servicem8 from "../../servicem8.app.mjs";
import {
  optionalBool10String,
  optionalParsedInt,
} from "../../common/payload.mjs";

export default {
  key: "servicem8-update-job-activity",
  name: "Update Job Activity",
  description: "Update a job activity (loads the record, merges your fields, then POSTs). [See the documentation](https://developer.servicem8.com/reference/updatejobactivities)",
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
          resource: "jobactivity",
          prevContext,
          query,
        });
      },
      label: "Job activity to update",
      description: "Activity record to load, merge, and save (search or paste UUID).",
    },
    jobUuid: {
      type: "string",
      label: "Job",
      useQuery: true,
      async options({
        $, prevContext, query,
      }) {
        return this.servicem8._uuidOptionsForResource({
          $: $ ?? this,
          resource: "job",
          prevContext,
          query,
        });
      },
      optional: true,
      description: "The UUID of the job this activity belongs to",
    },
    staffUuid: {
      type: "string",
      label: "Staff",
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
      optional: true,
      description: "The UUID of the staff member assigned to this activity",
    },
    startDate: {
      type: "string",
      label: "Start Date",
      optional: true,
      description: "Scheduled start date and time of the activity",
    },
    endDate: {
      type: "string",
      label: "End Date",
      optional: true,
      description: "Scheduled end date and time of the activity",
    },
    activityWasScheduled: {
      type: "boolean",
      label: "Activity Was Scheduled",
      optional: true,
      description:
        "Scheduled in advance; cannot be true if Activity Was Recorded is true. Sends `\"1\"` / `\"0\"`.",
    },
    activityWasRecorded: {
      type: "boolean",
      label: "Activity Was Recorded",
      optional: true,
      description:
        "Recorded after completion, not scheduled ahead; cannot be true if Activity Was Scheduled is true. Sends `\"1\"` / `\"0\"`.",
    },
    activityWasAutomated: {
      type: "string",
      label: "Activity Was Automated",
      optional: true,
      description: "Integer flag (e.g. 0) for automated activities",
    },
    hasBeenOpened: {
      type: "boolean",
      label: "Has Been Opened",
      optional: true,
      description:
        "Whether assigned staff has viewed this activity; relevant when scheduled. Sends `\"1\"` / `\"0\"`.",
    },
    hasBeenOpenedTimestamp: {
      type: "string",
      label: "Has Been Opened Timestamp",
      optional: true,
      description: "When staff first viewed the activity (`YYYY-MM-DD HH:MM:SS`)",
    },
    travelTimeInSeconds: {
      type: "string",
      label: "Travel Time (seconds)",
      optional: true,
      description: "Estimated travel time to the activity location, in seconds",
    },
    travelDistanceInMeters: {
      type: "string",
      label: "Travel Distance (meters)",
      optional: true,
      description: "Estimated travel distance to the activity location, in meters",
    },
    allocatedByStaffUuid: {
      type: "string",
      label: "Allocated By Staff",
      optional: true,
      description:
        "Staff member who allocated this activity (deprecated in the API; optional).",
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
    },
    allocatedTimestamp: {
      type: "string",
      label: "Allocated Timestamp",
      optional: true,
      description: "Deprecated in the API",
    },
    materialUuid: {
      type: "string",
      label: "Job material",
      useQuery: true,
      async options({
        $, prevContext, query,
      }) {
        return this.servicem8._uuidOptionsForResource({
          $: $ ?? this,
          resource: "jobmaterial",
          prevContext,
          query,
        });
      },
      optional: true,
      description:
        "Job material UUID used to determine activity cost",
    },
  },
  async run({ $ }) {
    const response = await this.servicem8.updateJobActivity({
      $,
      uuid: this.uuid,
      data: {
        job_uuid: this.jobUuid,
        staff_uuid: this.staffUuid,
        start_date: this.startDate,
        end_date: this.endDate,
        activity_was_scheduled: optionalBool10String(this.activityWasScheduled),
        activity_was_recorded: optionalBool10String(this.activityWasRecorded),
        activity_was_automated: optionalParsedInt(this.activityWasAutomated),
        has_been_opened: optionalBool10String(this.hasBeenOpened),
        has_been_opened_timestamp: this.hasBeenOpenedTimestamp,
        travel_time_in_seconds: optionalParsedInt(this.travelTimeInSeconds),
        travel_distance_in_meters: optionalParsedInt(this.travelDistanceInMeters),
        allocated_by_staff_uuid: this.allocatedByStaffUuid,
        allocated_timestamp: this.allocatedTimestamp,
        material_uuid: this.materialUuid,
      },
    });
    $.export("$summary", `Updated Job Activity ${this.uuid}`);
    return response;
  },
};
