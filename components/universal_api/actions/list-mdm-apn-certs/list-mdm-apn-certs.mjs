import app from "../../universal_api.app.mjs";
import { MDM_SERVICE_IDS } from "../../common/constants.mjs";

export default {
  key: "universal_api-list-mdm-apn-certs",
  name: "List MDM APN Certificates",
  description:
    "List APN (Apple Push Notification) certificates from the MDM API on Universal API. Returns an array (paginated internally, up to `maxResults`). [See the documentation](https://docs.universalapi.io/reference/list-apn-certs).",
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
    const {
      data, hasMore,
    } = await this.app.paginate({
      fn: this.app.listMdmApnCerts,
      args: {
        $,
        serviceId: this.serviceId,
      },
      maxResults: this.maxResults,
    });
    $.export("$summary", `Successfully retrieved ${data.length} MDM APN certificate(s)`);
    return {
      data,
      hasMore,
    };
  },
};
