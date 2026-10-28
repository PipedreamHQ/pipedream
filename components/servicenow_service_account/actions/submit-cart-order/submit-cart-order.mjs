import action from "@pipedream/servicenow/actions/submit-cart-order/submit-cart-order.mjs";
import { wrapAction } from "../../common/utils.mjs";

export default wrapAction(action, {
  key: "servicenow_service_account-submit-cart-order",
  version: "0.0.1",
});
