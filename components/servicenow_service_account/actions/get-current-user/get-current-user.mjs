import action from "@pipedream/servicenow/actions/get-current-user/get-current-user.mjs";
import { wrapAction } from "../../common/utils.mjs";

export default wrapAction(action, {
  description: "Returns the ServiceNow integration user this connection authenticates as (`sys_id`, name, email, username) and the instance URL. This is a service account, not the person you act for: do not use its `sys_id` to answer 'my incidents' or 'assigned to me', or as a caller or requester. Look up the person with **Find Users** instead. Use this action to confirm which account and instance the connection uses, or to find records the integration user created (e.g. `sys_created_by={user_name}` in **Get Table Records**). [See the documentation](https://docs.servicenow.com/bundle/vancouver-api-reference/page/integrate/inbound-rest/concept/c_TableAPI.html).",
});
