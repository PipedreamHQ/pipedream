import servicenow from "../../servicenow.app.mjs";

export default {
  key: "servicenow-get-current-user",
  name: "Get Current User",
  description: "Returns the authenticated ServiceNow user's sys_id, name, email, username, and instance URL. Call this first when the user says 'my incidents', 'my cases', 'assigned to me', or needs their ServiceNow identity. Use `sys_id` to filter records in **Get Table Records** (e.g. `assigned_to={sys_id}`) or **Create Table Record**. [See the documentation](https://docs.servicenow.com/bundle/vancouver-api-reference/page/integrate/inbound-rest/concept/c_TableAPI.html).",
  version: "0.0.4",
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
    const sessionInfo = await this.servicenow._makeRequest({
      $,
      url: "/ui/user/current_user",
    });

    const userSysId = sessionInfo?.sys_id;

    if (!userSysId) {
      throw new Error("Unable to determine current user from session");
    }

    const user = await this.servicenow._makeRequest({
      $,
      url: `/table/sys_user/${userSysId}`,
      params: {
        sysparm_fields: "sys_id,user_name,name,email,title,department,location",
      },
    });

    const summaryName = user.name || user.user_name || user.sys_id;
    $.export("$summary", `Retrieved user ${summaryName}`);

    return {
      instance_url: `https://${this.servicenow.$auth.instance_name}.service-now.com`,
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
