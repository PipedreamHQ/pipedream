// legacy_hash_id: a_vgidpp
import { axios } from "@pipedream/platform";

export default {
  key: "xero_accounting_api-get-tenant-connections",
  name: "Get Tenant Connections",
  description: "Gets the tenants connections the user is authorized to access",
  version: "0.1.1",
  type: "action",
  props: {
    xero_accounting_api: {
      type: "app",
      app: "xero_accounting_api",
    },
  },
  async run({ $ }) {
  //See the API docs: https://developer.xero.com/documentation/oauth2/auth-flow
  //Step 5. Check the tenants you're authorized to access

    return await axios($, {
      url: "https://api.xero.com/connections",
      headers: {
        Authorization: `Bearer ${this.xero_accounting_api.$auth.oauth_access_token}`,
      },
    });
  },
};
