import action from "@pipedream/servicenow/actions/add-item-to-cart/add-item-to-cart.mjs";
import { wrapAction } from "../../common/utils.mjs";

export default wrapAction(action);
