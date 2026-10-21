import action from "@pipedream/servicenow/actions/checkout-cart/checkout-cart.mjs";
import { wrapAction } from "../../common/utils.mjs";

export default wrapAction(action);
