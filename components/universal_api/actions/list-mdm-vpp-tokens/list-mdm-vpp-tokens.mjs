import app from "../../universal_api.app.mjs";

export default {
  key: "universal_api-list-mdm-vpp-tokens",
  name: "List MDM VPP Tokens",
  description:
    "List VPP (Volume Purchase Program) tokens from the MDM API on Universal API. Returns an array; use the returned IDs with **Get MDM VPP Token**. [See the documentation](https://docs.universalapi.io/reference/list-vpp-tokens).",
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
    serviceId: {
      propDefinition: [
        app,
        "mdmServiceId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.listMdmVppTokens({
      $,
      consumerId: this.consumerId,
      serviceId: this.serviceId,
    });
    $.export("$summary", `Successfully retrieved ${response.data?.length ?? 0} MDM VPP token(s)`);
    return response;
  },
};
