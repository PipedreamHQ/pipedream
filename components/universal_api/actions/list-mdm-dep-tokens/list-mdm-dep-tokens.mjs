import app from "../../universal_api.app.mjs";
import { MDM_SERVICE_IDS } from "../../common/constants.mjs";

export default {
  key: "universal_api-list-mdm-dep-tokens",
  name: "List MDM DEP Tokens",
  description:
    "List DEP (Device Enrollment Program) tokens from the MDM API on Universal API. Returns an array (paginated internally, up to `maxResults`); use the returned IDs with **Get MDM DEP Token**. [See the documentation](https://docs.universalapi.io/reference/list-dep-tokens).",
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
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.paginate({
      fn: this.app.listMdmDepTokens,
      args: {
        $,
        serviceId: this.serviceId,
      },
      maxResults: this.maxResults,
    });
    $.export("$summary", `Successfully retrieved ${response.length} MDM DEP token(s)`);
    return response;
  },
};
