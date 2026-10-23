import action from "@pipedream/servicenow/actions/get-requested-items/get-requested-items.mjs";
import { wrapAction } from "../../common/utils.mjs";

export default wrapAction(action, {
  key: "servicenow_service_account-get-requested-items",
  version: "0.0.1",
});
