import dayjs from "dayjs";
import app from "../../airmeet.app.mjs";
import constants from "../common/constants.mjs";

export default {
  name: "Create Airmeet",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "airmeet-create-airmeet",
  description: "Creates an airmeet. [See the documentation](https://help.airmeet.com/support/solutions/articles/82000467794-airmeet-public-apis-v2-0#6.1-Create-Airmeet)",
  type: "action",
  props: {
    app,
    hostEmail: {
      type: "string",
      label: "Host Email",
      description: "Email of the host",
    },
    eventName: {
      type: "string",
      label: "Event Name",
      description: "Name of the event",
    },
    shortDesc: {
      type: "string",
      label: "Short Description",
      description: "Short description of the event",
    },
    startTime: {
      type: "string",
      label: "Start Time",
      description: "Start time for the event in milliseconds or ISO 8601. E.g. `1697458790918` or `2023-10-16T12:18:38+00:00`",
    },
    endTime: {
      type: "string",
      label: "End Time",
      description: "End time for the event in milliseconds or ISO 8601. E.g. `1697458790918` or `2023-10-16T12:18:38+00:00`",
    },
    timezone: {
      type: "string",
      label: "Timezone",
      description: "Timezone for the event in the canonical tz name. E.g. 'Asia/Kolkata'",
      options: constants.TIME_ZONES,
    },
  },
  async run({ $ }) {
    const startTime = dayjs(this.startTime).valueOf();
    const endTime = dayjs(this.endTime).valueOf();

    const response = await this.app.createAirmeet({
      $,
      data: {
        hostEmail: this.hostEmail,
        eventName: this.eventName,
        shortDesc: this.shortDesc,
        timing: {
          startTime: startTime,
          endTime: endTime,
          timezone: this.timezone,
        },
      },
    });

    if (response) {
      $.export("$summary", `Successfully created airmeet with UUID \`${response.uuid}\``);
    }

    return response;
  },
};
