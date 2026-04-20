import { axios } from "@pipedream/platform";
import servicenow from "../../servicenow.app.mjs";

export default {
  key: "servicenow-get-current-user",
  name: "Get Current User",
  description: "Returns the authenticated ServiceNow user's sys_id, name, email, username, and instance URL. Call this first when the user says 'my incidents', 'my cases', 'assigned to me', or needs their ServiceNow identity. Use `sys_id` to filter records in **Get Table Records** (e.g. `assigned_to={sys_id}`) or **Create Table Record**. [See the documentation](https://docs.servicenow.com/bundle/vancouver-api-reference/page/integrate/inbound-rest/concept/c_TableAPI.html).",
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
    const sessionInfo = await axios($, {
      url: `${this.servicenow.baseUrl()}/api/now/ui/user/current_user`,
      headers: this.servicenow.authHeaders(),
    });

    const userSysId = sessionInfo.result?.user_sys_id;

    if (!userSysId) {
      throw new Error("Unable to determine current user from session");
    }

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

    return {
      instance_url: this.servicenow.baseUrl(),
      sys_id: user.sys_id,
      user_name: user.user_name,
      name: user.name,
      email: user.email,
      title: user.title,
      department: user.department,
      location: user.location,
    };
  },
};
