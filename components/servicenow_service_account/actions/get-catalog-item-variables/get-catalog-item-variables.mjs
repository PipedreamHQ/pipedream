import action from "@pipedream/servicenow/actions/get-catalog-item-variables/get-catalog-item-variables.mjs";
import { wrapAction } from "../../common/utils.mjs";

export default wrapAction(action, {
  key: "servicenow_service_account-get-catalog-item-variables",
});
