import action from "@pipedream/servicenow/actions/delete-table-record/delete-table-record.mjs";
import { wrapAction } from "../../common/utils.mjs";

export default wrapAction(action, {
  key: "servicenow_service_account-delete-table-record",
});
