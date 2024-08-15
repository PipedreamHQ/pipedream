import { ConfigurationError } from "@pipedream/platform";
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
      description: "The start time of the shift in ISO8601 format (YYYY-MM-DDTHH:MM:SS.SSSZ).",
    },
    endTime: {
      type: "string",
      label: "End Time",
      description: "The end time of the shift in ISO8601 format (YYYY-MM-DDTHH:MM:SS.SSSZ).",
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
      type: "string[]",
      label: "Notes",
      description: "Additional notes for the shift. HTML is supported. Example `<p>Note example</p>` [See the documentation](https://developer.connecteam.com/reference/create_shifts_scheduler_v1_schedulers__schedulerid__shifts_post).",
      optional: true,
    },
    breaks: {
      type: "string[]",
      label: "Breaks",
      description: "A list of stringified objects of breaks to create for the shift. Example `{\"name\":\"Break name example\",\"type\":\"paid\",\"startTime\":123456789,\"duration\":123}` [See the documentation](https://developer.connecteam.com/reference/create_shifts_scheduler_v1_schedulers__schedulerid__shifts_post).",
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
  methods: {
    checkDatetime(dateTime) {
      try {
        new Date(dateTime).toISOString();
        return Date.parse(new Date(dateTime)) / 1000;
      } catch (e) {
        throw new Error(JSON.stringify({
          "error": {
            "errorDate": {
              message: "Invalid datetime format.",
            },
          },
        }));
      }
    },
  },
  async run({ $ }) {
    try {
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
            startTime: this.checkDatetime(startTime),
            endTime: this.checkDatetime(endTime),
            notes: parseObject(data.notes)?.map((note) => ({
              html: note,
            })),
            breaks: parseObject(data.breaks),
          },
        ],
      });

      $.export("$summary", `Successfully created shift with ID ${response.data.shifts[0].id}`);
      return response;
    } catch ({ message }) {
      const errors = JSON.parse(message);
      const keys = Object.keys(errors.error);
      throw new ConfigurationError(errors.error[keys[0]].message);
    }
  },
};
