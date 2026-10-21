import action from "@pipedream/servicenow/actions/submit-cart-order/submit-cart-order.mjs";
import { wrapAction } from "../../common/utils.mjs";

export default wrapAction(action);
