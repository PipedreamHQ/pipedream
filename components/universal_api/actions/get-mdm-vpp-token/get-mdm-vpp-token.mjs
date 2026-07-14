import app from "../../universal_api.app.mjs";

export default {
  key: "universal_api-get-mdm-vpp-token",
  name: "Get MDM VPP Token",
  description:
    "Retrieve a single VPP token by ID from the MDM API on Universal API. Run **List MDM VPP Tokens** first to discover valid IDs. [See the documentation](https://docs.universalapi.io/reference/get-vpp-token).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    consumerId: {
      propDefinition: [
        app,
        "consumerId",
      ],
    },
    vppTokenId: {
      propDefinition: [
        app,
        "vppTokenId",
      ],
    },
    serviceId: {
      propDefinition: [
        app,
        "mdmServiceId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getMdmVppToken({
      $,
      consumerId: this.consumerId,
      vppTokenId: this.vppTokenId,
      serviceId: this.serviceId,
    });
    $.export("$summary", `Successfully retrieved MDM VPP token ${this.vppTokenId}`);
    return response;
  },
};
