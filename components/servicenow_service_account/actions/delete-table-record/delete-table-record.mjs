import action from "@pipedream/servicenow/actions/delete-table-record/delete-table-record.mjs";
import { wrapAction } from "../../common/utils.mjs";

export default wrapAction(action);
