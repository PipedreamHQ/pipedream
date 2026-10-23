import action from "@pipedream/servicenow/actions/view-cart/view-cart.mjs";
import { wrapAction } from "../../common/utils.mjs";

export default wrapAction(action, {
  key: "servicenow_service_account-view-cart",
});
