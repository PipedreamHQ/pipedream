import action from "@pipedream/servicenow/actions/submit-order-guide/submit-order-guide.mjs";
import { wrapAction } from "../../common/utils.mjs";

export default wrapAction(action, {
  key: "servicenow_service_account-submit-order-guide",
  version: "0.0.1",
});
