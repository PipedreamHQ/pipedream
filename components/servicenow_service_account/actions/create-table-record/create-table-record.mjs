import action from "@pipedream/servicenow/actions/create-table-record/create-table-record.mjs";
import { wrapAction } from "../../common/utils.mjs";

export default wrapAction(action, {
  note: "The record is created by the integration user: `sys_created_by` is always that account, and person fields you leave empty, such as `opened_by` on task tables, default to it. To attribute the record to a person, set their `sys_id` in the table's person fields in **Record Data**.",
  example: "table `incident` with record data `{\"short_description\": \"VPN is down\", \"urgency\": \"2\", \"caller_id\": \"<user sys_id>\"}` returns the new incident including its `number` and `sys_id`.",
  propDescriptions: {
    recordData: "The field values for the new record, as key-value pairs (e.g. `{ \"short_description\": \"VPN is down\", \"caller_id\": \"<user sys_id>\" }`). The integration user creates the record, so to attribute it to a person, set the table's person reference fields to their `sys_id` from **Find Users**: `caller_id` on `incident`, `opened_by` on any task table (defaults to the integration user when omitted), and `requested_for` on `sc_request` and `sc_req_item`. Run **Get Table Fields** to confirm which person fields the table has. ServiceNow skips fields the integration user's ACLs do not allow it to write, without an error, so check those fields in the returned record. `sys_created_by` and `sys_updated_by` are system fields and always show the integration user.",
  },
});
