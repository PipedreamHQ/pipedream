import crowdstrikeFalcon from "../../crowdstrike_falcon.app.mjs";
import { HOST_ACTION_NAMES_OPTIONS } from "../../common/constants.mjs";

export default {
  key: "crowdstrike_falcon-manage-host-containment",
  name: "Manage Host Containment",
  description: "Manage host containment on one or more CrowdStrike Falcon hosts via POST /devices/entities/devices-actions/v2 (`action_name` query param, `ids` body). Use **Search Hosts** or **Get Host** to find device IDs. [See the documentation](https://developer.crowdstrike.com/api-reference/collections/hosts/#performactionv2).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    crowdstrikeFalcon,
    actionName: {
      type: "string",
      label: "Action",
      description: "Containment action to perform. One of: " + HOST_ACTION_NAMES_OPTIONS.map((option) => option.label).join(", "),
      options: HOST_ACTION_NAMES_OPTIONS,
    },
    deviceIds: {
      propDefinition: [
        crowdstrikeFalcon,
        "deviceIds",
      ],
      description: "Device IDs to act on. Run **Search Hosts** to obtain these IDs. Sent as `ids` in the request body.",
    },
  },
  async run({ $ }) {
    const response = await this.crowdstrikeFalcon.performHostAction({
      $,
      params: {
        action_name: this.actionName,
      },
      data: {
        ids: this.deviceIds,
      },
    });
    $.export("$summary", `Action '${this.actionName}' applied to ${this.deviceIds?.length ?? 0} host${this.deviceIds?.length !== 1
      ? "s"
      : ""}`);
    return response;
  },
};
