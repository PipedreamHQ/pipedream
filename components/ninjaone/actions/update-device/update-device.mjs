import ninjaone from "../../ninjaone.app.mjs";

export default {
  key: "ninjaone-update-device",
  name: "Update Device",
  description: "Update details for a specific device in NinjaOne. [See the documentation](https://app.ninjarmm.com/apidocs/?links.active=core)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ninjaone,
    deviceId: {
      propDefinition: [
        ninjaone,
        "deviceId",
      ],
      description: "The ID of the device to update ",
    },
    displayName: {
      type: "string",
      label: "Display Name",
      description: "The name of the device",
      optional: true,
    },
    nodeRoleId: {
      propDefinition: [
        ninjaone,
        "nodeRoleId",
      ],
      optional: true,
    },
    policyId: {
      propDefinition: [
        ninjaone,
        "policyId",
      ],
      optional: true,
    },
    organizationId: {
      propDefinition: [
        ninjaone,
        "organizationId",
      ],
      optional: true,
    },
    locationId: {
      propDefinition: [
        ninjaone,
        "locationId",
        ({ organizationId }) => ({
          organizationId,
        }),
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      ninjaone,
      deviceId,
      ...data
    } = this;

    const response = await ninjaone.updateDevice({
      $,
      deviceId,
      data,
    });

    $.export("$summary", `Successfully updated device with ID ${deviceId}`);
    return response;
  },
};
