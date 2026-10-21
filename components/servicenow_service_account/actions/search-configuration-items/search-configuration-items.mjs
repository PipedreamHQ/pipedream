import action from "@pipedream/servicenow/actions/search-configuration-items/search-configuration-items.mjs";
import { wrapAction } from "../../common/utils.mjs";

export default wrapAction(action);
