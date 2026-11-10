import smartthings from "../../smartthings.app.mjs";

export default {
  key: "smartthings-list-devices",
  name: "List Devices",
  description: "Lists the devices available to the connected SmartThings account, optionally filtered by location or capability. [See the documentation](https://developer.smartthings.com/docs/api/public#tag/Devices/operation/getDevices)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    smartthings,
    locationId: {
      propDefinition: [
        smartthings,
        "locationId",
      ],
      optional: true,
    },
    capability: {
      propDefinition: [
        smartthings,
        "capability",
      ],
      description: "Only return devices that have this capability, e.g. `switch`. [See the capabilities reference](https://developer.smartthings.com/docs/devices/capabilities/capabilities-reference)",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of devices to return. Leave blank to return all devices.",
      min: 1,
      optional: true,
    },
  },
  async run({ $ }) {
    const devices = [];
    const items = this.smartthings.paginate({
      resourceFn: (opts) => this.smartthings.listDevices({
        $,
        ...opts,
      }),
      params: {
        locationId: this.locationId,
        capability: this.capability,
      },
      max: this.maxResults,
    });
    for await (const item of items) {
      devices.push(item);
    }
    $.export("$summary", `Successfully retrieved ${devices.length} device${devices.length === 1
      ? ""
      : "s"}`);
    return devices;
  },
};
