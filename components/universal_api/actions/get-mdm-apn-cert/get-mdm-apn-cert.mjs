import app from "../../universal_api.app.mjs";
import { MDM_SERVICE_IDS } from "../../common/constants.mjs";

export default {
  key: "universal_api-get-mdm-apn-cert",
  name: "Get MDM APN Certificate",
  description:
    "Retrieve a single APN certificate from the MDM API on Universal API. Run **List MDM APN Certificates** first to discover valid IDs. [See the documentation](https://docs.universalapi.io/reference/get-apn-cert).",
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
    const response = await this.app.getMdmApnCert({
      $,
      serviceId: this.serviceId,
    });
    $.export("$summary", "Successfully retrieved MDM APN certificate.");
    return response;
  },
};
