import { axios } from "@pipedream/platform";
import app from "../../servicenow.app.mjs";

export default {
  key: "servicenow-get-current-user",
  name: "Get Current User",
  description: "Returns the authenticated ServiceNow user's identity: sys_id, name, email, username, title, department, and the instance URL."
    + " **When to use:** call first for any 'my incidents', 'my cases', 'assigned to me', or 'who am I' intent — you'll need the returned `sys_id` to filter records in other tools (e.g. `assigned_to={sys_id}` in **Search Records**)."
    + " **Returns:** `{ instance_url, sys_id, user_name, name, email, title, department, location }`."
    + " **Cross-references:** Use the `sys_id` as the `assigned_to` / `caller_id` / `opened_by` filter in **Search Records** and as a reference value in **Create Record** / **Update Record**."
    + " [See the documentation](https://docs.servicenow.com/bundle/zurich-api-reference/page/integrate/inbound-rest/concept/c_TableAPI.html)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
  },
  async run({ $ }) {
    const sessionInfo = await axios($, {
      url: `${this.app.baseUrl()}/api/now/ui/user/current_user`,
      headers: this.app.authHeaders(),
    });

    const userSysId = sessionInfo.result?.user_sys_id;
    if (!userSysId) {
      throw new Error("Unable to determine current user from session");
    }

    const userResponse = await axios($, {
      url: `${this.app.baseUrl()}/api/now/table/sys_user/${userSysId}`,
      headers: this.app.authHeaders(),
      params: {
        sysparm_fields: "sys_id,user_name,name,email,title,department,location",
      },
    });

    const user = userResponse.result;
    const summaryName = user.name || user.user_name || user.sys_id;
    $.export("$summary", `Retrieved user ${summaryName}`);

    return {
      instance_url: this.app.baseUrl(),
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
