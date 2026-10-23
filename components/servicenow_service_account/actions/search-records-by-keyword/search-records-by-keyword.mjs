import action from "@pipedream/servicenow/actions/search-records-by-keyword/search-records-by-keyword.mjs";
import { wrapAction } from "../../common/utils.mjs";

export default wrapAction(action, {
  key: "servicenow_service_account-search-records-by-keyword",
  description: "Search a ServiceNow table for records whose `name` or `label` field contains a keyword. Only those two fields are searched, so it only fits tables that have both, such as `sys_db_object`, and returns nothing useful on tables without them, such as `incident`. For any other field, use **Get Table Records** with an encoded query instead. [See the documentation](https://www.servicenow.com/docs/bundle/zurich-api-reference/page/integrate/inbound-rest/concept/c_TableAPI.html#title_table-GET)",
  example: "table `sys_db_object` with keyword `incident` returns the tables whose name or label contains `incident`.",
});
