import action from "@pipedream/servicenow/actions/check-order-status/check-order-status.mjs";
import { wrapAction } from "../../common/utils.mjs";

export default wrapAction(action, {
  key: "servicenow_service_account-check-order-status",
});
