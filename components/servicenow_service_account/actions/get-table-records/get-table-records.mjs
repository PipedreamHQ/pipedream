import action from "@pipedream/servicenow/actions/get-table-records/get-table-records.mjs";
import { wrapAction } from "../../common/utils.mjs";

export default wrapAction(action, {
  example: "table `incident` with query `active=true^priority=1` and limit `10` returns up to 10 active critical incidents.",
});
