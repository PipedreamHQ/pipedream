import action from "@pipedream/servicenow/actions/get-incident/get-incident.mjs";
import { wrapAction } from "../../common/utils.mjs";

export default wrapAction(action);
