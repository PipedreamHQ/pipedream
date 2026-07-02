import superCarl from "../../super_carl.app.mjs";
import { cleanObject } from "../../common/utils.mjs";

export default {
  key: "super_carl-get-network-summary",
  name: "Get Network Summary",
  description: "Check Super Carl network readiness before running **Search People**, **Search Jobs**, or **Search Companies**. Use this to inspect LinkedIn/Gmail/Super Carl graph sync status for the API key owner or a delegated team-seat user via Delegate User ID; low or unsynced counts can explain weak network-aware results. [See the documentation](https://supercarl.ai/docs/endpoints)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    superCarl,
    delegateUserId: {
      propDefinition: [
        superCarl,
        "delegateUserId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.superCarl.getNetworkSummary({
      $,
      params: cleanObject({
        delegate_user_id: this.delegateUserId,
      }),
    });

    const networks = Array.isArray(response?.networks)
      ? response.networks
      : [];
    const linkedin = networks.find(({ key }) => key === "linkedin");
    const status = linkedin
      ? `${linkedin.count || 0} LinkedIn connections, sync ${
        linkedin.needsSync
          ? "needed"
          : "ready"
      }`
      : `${networks.length} network entries returned`;

    $.export("$summary", status);
    return response;
  },
};
