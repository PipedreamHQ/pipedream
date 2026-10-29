import action from "@pipedream/servicenow/actions/update-table-record/update-table-record.mjs";
import { wrapAction } from "../../common/utils.mjs";

export default wrapAction(action, {
  key: "servicenow_service_account-update-table-record",
  version: "0.0.1",
  example: "table `incident`, a record ID from **Get Table Records**, and update fields `{\"state\": \"6\"}` changes only the state and returns the updated record.",
});
