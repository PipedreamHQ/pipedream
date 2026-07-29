import app from "../../universal_api.app.mjs";

export default {
  key: "universal_api-get-mdm-dep-token",
  name: "Get MDM DEP Token",
  description:
    "Retrieve a single DEP token by ID from the MDM API on Universal API. Run **List MDM DEP Tokens** first to discover valid IDs. [See the documentation](https://docs.universalapi.io/reference/get-dep-tokens).",
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
    depTokenId: {
      propDefinition: [
        app,
        "depTokenId",
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
    const response = await this.app.getMdmDepToken({
      $,
      consumerId: this.consumerId,
      depTokenId: this.depTokenId,
      serviceId: this.serviceId,
    });
    $.export("$summary", `Successfully retrieved MDM DEP token ${this.depTokenId}`);
    return response;
  },
};
