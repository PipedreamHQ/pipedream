import app from "../../jibble.app.mjs";

export default {
  name: "Clock In",
  description: "Create a new clock in time entry [See the documentation](https://docs.api.jibble.io/#ec4b4f62-5832-4911-92b1-81501b7d681c).",
  key: "jibble-clock-in",
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
    activityId: {
      propDefinition: [
        app,
        "activityId",
      ],
      description: "The ID of the activity to clock in.",
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
    latitude: {
      propDefinition: [
        app,
        "latitude",
      ],
    },
    longitude: {
      propDefinition: [
        app,
        "longitude",
      ],
    },
    projectId: {
      propDefinition: [
        app,
        "projectId",
      ],
      description: "The ID of the project to clock in.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      personId: this.personId,
      activityId: this.activityId,
      projectId: this.projectId,
      clientType: this.clientType,
      platform: {
        clientVersion: this.clientVersion,
        os: this.os,
        deviceModel: this.deviceModel,
        deviceName: this.deviceName,
      },
      coordinates: {
        latitude: this.latitude,
        longitude: this.longitude,
      },
    };
    const res = await this.app.clockIn(data, $);
    $.export("summary", "Clock in successfully created.");
    return res;
  },
};
