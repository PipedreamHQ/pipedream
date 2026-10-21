import action from "@pipedream/servicenow/actions/find-users/find-users.mjs";
import { wrapAction } from "../../common/utils.mjs";

export default wrapAction(action, {
  example: "search field Email with value `jane.doe@example.com` returns the matching user with its `sys_id`.",
});
