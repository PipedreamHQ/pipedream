import action from "@pipedream/servicenow/actions/get-catalog-ui-policies/get-catalog-ui-policies.mjs";
import { wrapAction } from "../../common/utils.mjs";

export default wrapAction(action, {
  key: "servicenow_service_account-get-catalog-ui-policies",
  version: "0.0.1",
});
