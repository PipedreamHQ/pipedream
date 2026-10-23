import action from "@pipedream/servicenow/actions/delete-cart-item/delete-cart-item.mjs";
import { wrapAction } from "../../common/utils.mjs";

export default wrapAction(action, {
  key: "servicenow_service_account-delete-cart-item",
  version: "0.0.1",
});
