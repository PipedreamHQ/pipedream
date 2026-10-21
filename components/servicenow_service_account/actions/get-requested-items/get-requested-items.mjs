import action from "@pipedream/servicenow/actions/get-requested-items/get-requested-items.mjs";
import { wrapAction } from "../../common/utils.mjs";

export default wrapAction(action);
