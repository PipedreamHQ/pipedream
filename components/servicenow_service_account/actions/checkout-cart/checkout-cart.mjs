import action from "@pipedream/servicenow/actions/checkout-cart/checkout-cart.mjs";
import { wrapAction } from "../../common/utils.mjs";

export default wrapAction(action, {
  key: "servicenow_service_account-checkout-cart",
});
