import action from "@pipedream/servicenow/actions/get-catalog-ui-policies/get-catalog-ui-policies.mjs";
import { wrapAction } from "../../common/utils.mjs";

export default wrapAction(action);
