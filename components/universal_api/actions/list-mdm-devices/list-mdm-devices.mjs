import app from "../../universal_api.app.mjs";
import { MDM_SERVICE_IDS } from "../../common/constants.mjs";

export default {
  key: "universal_api-list-mdm-devices",
  name: "List MDM Devices",
  description:
    "List devices from the MDM API on Universal API. Returns an array of device objects. [See the documentation](https://docs.universalapi.io/reference/list-devices).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
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
    const response = await this.app.listMdmDevices({
      $,
      serviceId: this.serviceId,
    });
    $.export("$summary", `Successfully retrieved ${response.data?.length ?? 0} MDM device(s)`);
    return response;
  },
};
