import action from "@pipedream/servicenow/actions/empty-cart/empty-cart.mjs";
import { wrapAction } from "../../common/utils.mjs";

export default wrapAction(action, {
  key: "servicenow_service_account-empty-cart",
  version: "0.0.1",
});
