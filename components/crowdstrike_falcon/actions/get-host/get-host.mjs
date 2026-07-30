import crowdstrikeFalcon from "../../crowdstrike_falcon.app.mjs";

export default {
  key: "crowdstrike_falcon-get-host",
  name: "Get Host",
  description: "Retrieve full CrowdStrike Falcon device records for one or more device IDs via GET /devices/entities/devices/v2, including hostname, os_version, agent_version, status (containment status) and reduced_functionality_mode (sensor health). Use **Search Hosts** to find device IDs first. [See the documentation](https://developer.crowdstrike.com/api-reference/collections/hosts/#getdevicedetailsv2).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    crowdstrikeFalcon,
    deviceIds: {
      propDefinition: [
        crowdstrikeFalcon,
        "deviceIds",
      ],
      description: "Device IDs to retrieve. Run **Search Hosts** to obtain these IDs. Sent as `ids` in the request body.",
    },
  },
  async run({ $ }) {
    const response = await this.crowdstrikeFalcon.getHosts({
      $,
      data: {
        ids: this.deviceIds,
      },
    });
    const devices = response.resources ?? [];
    $.export("$summary", `Retrieved ${devices?.length ?? 0} host${devices?.length !== 1
      ? "s"
      : ""}`);
    return response;
  },
};
