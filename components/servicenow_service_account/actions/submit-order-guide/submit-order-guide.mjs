import action from "@pipedream/servicenow/actions/submit-order-guide/submit-order-guide.mjs";
import { wrapAction } from "../../common/utils.mjs";

export default wrapAction(action);
