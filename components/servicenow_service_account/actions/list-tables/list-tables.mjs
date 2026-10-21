import action from "@pipedream/servicenow/actions/list-tables/list-tables.mjs";
import { wrapAction } from "../../common/utils.mjs";

export default wrapAction(action);
