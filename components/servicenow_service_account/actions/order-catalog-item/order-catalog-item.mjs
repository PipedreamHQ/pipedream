import action from "@pipedream/servicenow/actions/order-catalog-item/order-catalog-item.mjs";
import { wrapAction } from "../../common/utils.mjs";

export default wrapAction(action, {
  key: "servicenow_service_account-order-catalog-item",
  version: "0.0.1",
});
