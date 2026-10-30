import action from "@pipedream/servicenow/actions/get-record-counts-by-field/get-record-counts-by-field.mjs";
import { wrapAction } from "../../common/utils.mjs";

export default wrapAction(action, {
  key: "servicenow_service_account-get-record-counts-by-field",
  version: "0.0.1",
});
