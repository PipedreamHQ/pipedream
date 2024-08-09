import { parseObject } from "../../common/utils.mjs";
import connecteam from "../../connecteam.app.mjs";

export default {
  key: "connecteam-create-shift",
  name: "Create Shift",
  description: "Creates a new shift in the scheduler. [See the documentation](https://developer.connecteam.com/reference/create_shifts_scheduler_v1_schedulers__schedulerid__shifts_post)",
  version: "0.0.1",
  type: "action",
  props: {
    connecteam,
    schedulerId: {
      propDefinition: [
        connecteam,
        "schedulerId",
      ],
    },
    startTime: {
      type: "string",
      label: "Start Time",
      description: "The start time of the shift in ISO8601 format (YYYY-MM-DDTHH:MM:SSSZ).",
    },
    endTime: {
      type: "string",
      label: "End Time",
      description: "The end time of the shift in ISO8601 format (YYYY-MM-DDTHH:MM:SSSZ).",
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the shift.",
    },
    timezone: {
      type: "string",
      label: "Timezone",
      description: "The timezone of the shift in Tz format (e.g. America/New_York). If not specified, it uses the timezone configured in the app settings.",
      optional: true,
    },
    isPublished: {
      type: "boolean",
      label: "Is Published",
      description: "Whether the shift is published.",
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
      description: "The location data of the shift. Example `{\"gps\":{\"address\": \"Address Example 123\",\"longitude\":\"-12.345678\",\"latitude\":\"-12.345678\"},\"isReferencedToJob\":false}`. [See the documentation](https://developer.connecteam.com/reference/create_shifts_scheduler_v1_schedulers__schedulerid__shifts_post).",
      optional: true,
    },
    assignedUserId: {
      propDefinition: [
        connecteam,
        "assignedUserId",
      ],
      optional: true,
    },
    notes: {
      type: "object",
      label: "Notes",
      description: "Additional notes for the shift. Example `[{\"html\": \"<p>Note example</p>\"}]` [See the documentation](https://developer.connecteam.com/reference/create_shifts_scheduler_v1_schedulers__schedulerid__shifts_post).",
      optional: true,
    },
    breaks: {
      type: "object",
      label: "Breaks",
      description: "A list of breaks to create for the shift. Example `[{\"name\":\"Break name example\",\"type\":\"paid\",\"startTime\":123456789,\"duration\":123}]` [See the documentation](https://developer.connecteam.com/reference/create_shifts_scheduler_v1_schedulers__schedulerid__shifts_post).",
      optional: true,
    },
    isOpenShift: {
      type: "boolean",
      label: "Is Open Shift",
      description: "Whether the shift is an open shift.",
      optional: true,
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.isOpenShift) {
      props.isRequireAdminApproval = {
        type: "boolean",
        label: "Requires Admin Approval",
        description: "Whether the shift requires admin approval.",
        optional: true,
      };
    }
    return props;
  },
  async run({ $ }) {
    const {
      connecteam,
      schedulerId,
      startTime,
      endTime,
      ...data
    } = this;

    const response = await connecteam.createShift({
      $,
      schedulerId,
      data: [
        {
          ...data,
          locationData: parseObject(data.locationData),
          assignedUserIds: data.assignedUserId
            ? [
              data.assignedUserId,
            ]
            : undefined,
          startTime: startTime
            ? Date.parse(new Date(startTime)) / 1000
            : undefined,
          endTime: endTime
            ? Date.parse(new Date(endTime)) / 1000
            : undefined,
          notes: parseObject(data.notes),
          breaks: parseObject(data.breaks),
        },
      ],
    });

    $.export("$summary", `Successfully created shift with ID ${response.data.shifts[0].id}`);
    return response;
  },
};
