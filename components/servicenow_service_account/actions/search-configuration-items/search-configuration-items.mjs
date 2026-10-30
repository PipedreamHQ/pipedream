import action from "@pipedream/servicenow/actions/search-configuration-items/search-configuration-items.mjs";
import { wrapAction } from "../../common/utils.mjs";

export default wrapAction(action, {
  key: "servicenow_service_account-search-configuration-items",
  version: "0.0.1",
});
