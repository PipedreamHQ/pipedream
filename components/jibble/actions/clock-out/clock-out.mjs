import app from "../../jibble.app.mjs";

export default {
  name: "Clock Out",
  description: "Create a new clock out time entry [See the documentation](https://docs.api.jibble.io/#7144d8bb-616d-4a59-bea2-e621791328fc).",
  key: "jibble-clock-out",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    personId: {
      propDefinition: [
        app,
        "personId",
      ],
      description: "The ID of the person to clock in.",
    },
    clientType: {
      propDefinition: [
        app,
        "clientType",
      ],
    },
    clientVersion: {
      propDefinition: [
        app,
        "clientVersion",
      ],
    },
    os: {
      propDefinition: [
        app,
        "os",
      ],
    },
    deviceModel: {
      propDefinition: [
        app,
        "deviceModel",
      ],
    },
    deviceName: {
      propDefinition: [
        app,
        "deviceName",
      ],
    },
  },
  async run({ $ }) {
    const data = {
      personId: this.personId,
      clientType: this.clientType,
      platform: {
        clientVersion: this.clientVersion,
        os: this.os,
        deviceModel: this.deviceModel,
        deviceName: this.deviceName,
      },
    };
    const res = await this.app.clockOut(data, $);
    $.export("summary", "Clock out successfully created");
    return res;
  },
};
