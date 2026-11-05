import action from "@pipedream/servicenow/actions/add-item-to-cart/add-item-to-cart.mjs";
import { wrapAction } from "../../common/utils.mjs";

export default wrapAction(action, {
  key: "servicenow_service_account-add-item-to-cart",
  version: "0.0.1",
});
