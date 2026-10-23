import action from "@pipedream/servicenow/actions/checkout-order-guide/checkout-order-guide.mjs";
import { wrapAction } from "../../common/utils.mjs";

export default wrapAction(action, {
  key: "servicenow_service_account-checkout-order-guide",
});
