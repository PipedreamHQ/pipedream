import action from "@pipedream/servicenow/actions/find-users/find-users.mjs";
import { wrapAction } from "../../common/utils.mjs";

export default wrapAction(action, {
  key: "servicenow_service_account-find-users",
  version: "0.0.1",
  example: "search field Email with value `jane.doe@example.com` returns the matching user with its `sys_id`.",
});
