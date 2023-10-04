import app from "../../airmeet.app.mjs";
import constants from "../common/constants.mjs";

export default {
  name: "Create Airmeet",
  version: "0.0.1",
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
      type: "integer",
      label: "Start Time",
      description: "Start time for the event in milliseconds",
    },
    endTime: {
      type: "integer",
      label: "End Time",
      description: "End time for the event in milliseconds",
    },
    timezone: {
      type: "string",
      label: "Event Name",
      description: "Timezone for the event in the canonical tz name. E.g. 'Asia/Kolkata'",
      options: constants.TIME_ZONES,
    },
  },
  async run({ $ }) {
    const response = await this.app.createAirmeet({
      $,
      data: {
        hostEmail: this.hostEmail,
        eventName: this.eventName,
        shortDesc: this.shortDesc,
        timing: {
          startTime: this.startTime,
          endTime: this.endTime,
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
