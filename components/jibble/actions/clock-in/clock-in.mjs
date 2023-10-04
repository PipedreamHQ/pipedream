import app from "../../jibble.app.mjs";

export default {
  name: "Clock In",
  description: "Create a new Time Entry [See the documentation](https://docs.api.jibble.io/#ec4b4f62-5832-4911-92b1-81501b7d681c).",
  key: "jibble-clock-in",
  version: "0.0.9",
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
      type: "string",
      label: "Client Type",
      description: "The client type. Ex: `web`, `mobile`.",
    },
    clientVersion: {
      type: "string",
      label: "Client Version",
      description: "The client version. Ex: `web 3.0`.",
    },
    os: {
      type: "string",
      label: "OS",
      description: "The operating system. Ex: `Windows 10`.",
    },
    deviceModel: {
      type: "string",
      label: "Device Model",
      description: "The device model. Ex: `MacbookPro`.",
    },
    deviceName: {
      type: "string",
      label: "Device Name",
      description: "The device name. Ex: `TestLaptop`.",
    },
    latitude: {
      type: "string",
      label: "Latitude",
      description: "The latitude of the location.",
    },
    longitude: {
      type: "string",
      label: "Longitude",
      description: "The longitude of the location.",
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
      type: "In",
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
    $.export("summary", "Time Entry Created");
    return res;
  },
};
