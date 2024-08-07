import connecteam from "../../connecteam.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "connecteam-create-shift",
  name: "Create Shift",
  description: "Creates a new shift in the scheduler. [See the documentation](https://developer.connecteam.com/reference/create_shifts_scheduler_v1_schedulers__schedulerid__shifts_post)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    connecteam,
    startTime: {
      type: "integer",
      label: "Start Time",
      description: "The start time of the shift (timestamp in milliseconds)",
    },
    endTime: {
      type: "integer",
      label: "End Time",
      description: "The end time of the shift (timestamp in milliseconds)",
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the shift",
    },
    schedulerId: {
      propDefinition: [
        connecteam,
        "schedulerId",
      ],
    },
    isOpenShift: {
      type: "boolean",
      label: "Is Open Shift",
      description: "Whether the shift is an open shift",
      optional: true,
    },
    timezone: {
      type: "string",
      label: "Timezone",
      description: "The timezone of the shift",
      optional: true,
    },
    isPublished: {
      type: "boolean",
      label: "Is Published",
      description: "Whether the shift is published",
      optional: true,
    },
    jobId: {
      propDefinition: [
        connecteam,
        "jobId",
      ],
      optional: true,
    },
    locationData: {
      type: "object",
      label: "Location Data",
      description: "The location data of the shift",
      optional: true,
    },
    isRequireAdminApproval: {
      type: "boolean",
      label: "Requires Admin Approval",
      description: "Whether the shift requires admin approval",
      optional: true,
    },
    assignedUserIds: {
      propDefinition: [
        connecteam,
        "assignedUserIds",
      ],
      optional: true,
    },
    notes: {
      type: "string[]",
      label: "Notes",
      description: "The notes of the shift",
      optional: true,
    },
    statuses: {
      type: "object[]",
      label: "Statuses",
      description: "The statuses of the shift",
      optional: true,
    },
    breaks: {
      type: "object[]",
      label: "Breaks",
      description: "The breaks of the shift",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      startTime: this.startTime,
      endTime: this.endTime,
      title: this.title,
      isOpenShift: this.isOpenShift,
      timezone: this.timezone,
      isPublished: this.isPublished,
      jobId: this.jobId,
      locationData: this.locationData,
      isRequireAdminApproval: this.isRequireAdminApproval,
      assignedUserIds: this.assignedUserIds,
      notes: this.notes,
      statuses: this.statuses,
      breaks: this.breaks,
    };

    const response = await this.connecteam.createShift({
      schedulerId: this.schedulerId,
      ...data,
    });

    $.export("$summary", `Successfully created shift with ID ${response.id}`);
    return response;
  },
};
