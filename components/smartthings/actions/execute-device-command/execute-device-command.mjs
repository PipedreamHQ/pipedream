import smartthings from "../../smartthings.app.mjs";
import { parseArguments } from "../../common/utils.mjs";

export default {
  key: "smartthings-execute-device-command",
  name: "Execute Device Command",
  description: "Executes a capability command on a SmartThings device, e.g. turn a switch on or set a dimmer level. [See the documentation](https://developer.smartthings.com/docs/api/public#tag/Devices/operation/executeDeviceCommands)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    smartthings,
    locationId: {
      propDefinition: [
        smartthings,
        "locationId",
      ],
      description: "Filter the device list by location",
      optional: true,
    },
    deviceId: {
      propDefinition: [
        smartthings,
        "deviceId",
        (c) => ({
          locationId: c.locationId,
        }),
      ],
    },
    capability: {
      propDefinition: [
        smartthings,
        "capability",
      ],
    },
    command: {
      type: "string",
      label: "Command",
      description: "The command to execute, e.g. `on`, `off`, `setLevel`, `setColor`. The available commands depend on the capability.",
    },
    arguments: {
      type: "string[]",
      label: "Arguments",
      description: "Arguments for the command, in order. Each value is parsed as JSON when possible (e.g. `50` becomes a number, `{\"hue\":20,\"saturation\":80}` becomes an object); otherwise it is sent as a string.",
      optional: true,
    },
    component: {
      propDefinition: [
        smartthings,
        "component",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.smartthings.executeDeviceCommands({
      $,
      deviceId: this.deviceId,
      data: {
        commands: [
          {
            component: this.component || "main",
            capability: this.capability,
            command: this.command,
            arguments: parseArguments(this.arguments),
          },
        ],
      },
    });
    $.export("$summary", `Successfully sent command \`${this.command}\` to device ${this.deviceId}`);
    return response;
  },
};
