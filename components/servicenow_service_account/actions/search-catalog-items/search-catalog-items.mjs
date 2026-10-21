import action from "@pipedream/servicenow/actions/search-catalog-items/search-catalog-items.mjs";
import { wrapAction } from "../../common/utils.mjs";

export default wrapAction(action);
