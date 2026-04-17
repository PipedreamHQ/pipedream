// vandelay-test-dr
import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-get-user-details",
  name: "Get User Details",
  description:
    "Get details about the current authenticated HubSpot user, including their owner ID, email, hub ID, and account info."
    + " Use this to determine the user's identity — the `ownerId` is needed to filter CRM records owned by the current user"
    + " (e.g. 'my deals' requires filtering by `hubspot_owner_id`)."
    + " Also returns available CRM object types for the account."
    + " [See the documentation](https://developers.hubspot.com/docs/api/oauth/tokens)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    hubspot,
  },
  async run({ $ }) {
    const token = this.hubspot.$auth.oauth_access_token;

    const tokenInfo = await this.hubspot.makeRequest({
      $,
      api: "",
      endpoint: `/oauth/v1/access-tokens/${token}`,
    });

    const {
      user_id: userId,
      hub_id: hubId,
      user: email,
      scopes,
      token_type: tokenType,
    } = tokenInfo;

    let ownerInfo = null;
    try {
      const { results } = await this.hubspot.getOwners({
        $,
        params: {
          email,
        },
      });
      ownerInfo = results?.find((o) => o.email === email) || results?.[0] || null;
    } catch {
      // Owner lookup may fail if user doesn't have owner permissions
    }

    const result = {
      userId,
      hubId,
      email,
      tokenType,
      scopes,
      ownerId: ownerInfo?.id || null,
      ownerName: ownerInfo
        ? `${ownerInfo.firstName || ""} ${ownerInfo.lastName || ""}`.trim()
        : null,
    };

    $.export(
      "$summary",
      `Authenticated as ${email} (Hub ID: ${hubId}${ownerInfo
        ? `, Owner ID: ${ownerInfo.id}`
        : ""})`,
    );

    return result;
  },
};
