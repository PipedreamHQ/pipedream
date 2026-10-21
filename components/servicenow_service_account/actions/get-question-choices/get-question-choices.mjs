import action from "@pipedream/servicenow/actions/get-question-choices/get-question-choices.mjs";
import { wrapAction } from "../../common/utils.mjs";

export default wrapAction(action);
