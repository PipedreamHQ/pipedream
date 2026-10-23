import action from "@pipedream/servicenow/actions/get-table-record-by-id/get-table-record-by-id.mjs";
import { wrapAction } from "../../common/utils.mjs";

export default wrapAction(action, {
  key: "servicenow_service_account-get-table-record-by-id",
});
