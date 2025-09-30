import { v4 as uuid } from "uuid";
import app from "../../govee.app.mjs";

export default {
  key: "govee-retrieve-device-info",
  name: "Retrieve Device Info",
  description: "Retrieve the current status and metadata of a specific Govee device, such as its power state, color, mode, and health. [See the documentation](https://developer.govee.com/reference/get-devices-status).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    deviceId: {
      propDefinition: [
        app,
        "deviceId",
      ],
    },
  },
  methods: {
    getDeviceStatus(args = {}) {
      return this.app.post({
        path: "/device/state",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      app,
      getDeviceStatus,
      deviceId,
    } = this;

    const { data: devices } = await app.listDevices();
    const device = devices.find(({ device }) => device === deviceId);

    const response = await getDeviceStatus({
      $,
      data: {
        requestId: uuid(),
        payload: {
          sku: device.sku,
          device: deviceId,
        },
      },
    });
    $.export("$summary", "Successfully retrieved device info");
    return response;
  },
};
