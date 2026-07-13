import app from "../../universal_api.app.mjs";
import { MDM_SERVICE_IDS } from "../../common/constants.mjs";

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
    vppTokenId: {
      propDefinition: [
        app,
        "vppTokenId",
      ],
    },
    serviceId: {
      propDefinition: [
        app,
        "serviceId",
      ],
      description: "Optional `x-uapi-service-id` header to pick the integration when a consumer has multiple active MDM integrations. One of: `kandji`, `jamf`, `microsoft-intune`.",
      options: MDM_SERVICE_IDS,
    },
  },
  async run({ $ }) {
    const response = await this.app.getMdmVppToken({
      $,
      vppTokenId: this.vppTokenId,
      serviceId: this.serviceId,
    });
    $.export("$summary", `Successfully retrieved MDM VPP token ${this.vppTokenId}`);
    return response;
  },
};
