import { axios } from "@pipedream/platform";
import servicenow from "../../servicenow.app.mjs";

export default {
  key: "servicenow-get-current-user",
  name: "Get Current User",
  description: "Retrieve profile information for the authenticated ServiceNow user. Returns user sys_id, name, email, and username. [See the documentation](https://docs.servicenow.com/bundle/vancouver-api-reference/page/integrate/inbound-rest/concept/c_TableAPI.html).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    servicenow,
  },
  async run({ $ }) {
    // First get the current session user info
    const sessionInfo = await axios($, {
      url: `${this.servicenow.baseUrl()}/api/now/ui/user/current_user`,
      headers: this.servicenow.authHeaders(),
    });

    const userSysId = sessionInfo.result?.user_sys_id;

    if (!userSysId) {
      throw new Error("Unable to determine current user from session");
    }

    // Get user details from sys_user table
    const userResponse = await axios($, {
      url: `${this.servicenow.baseUrl()}/api/now/table/sys_user/${userSysId}`,
      headers: this.servicenow.authHeaders(),
      params: {
        sysparm_fields: "sys_id,user_name,name,email,title,department,location",
      },
    });

    const user = userResponse.result;
    const summaryName = user.name || user.user_name || user.sys_id;
    $.export("$summary", `Retrieved user ${summaryName}`);

    return user;
  },
};
