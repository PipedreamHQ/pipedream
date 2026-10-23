import action from "@pipedream/servicenow/actions/get-question-choices/get-question-choices.mjs";
import { wrapAction } from "../../common/utils.mjs";

export default wrapAction(action, {
  key: "servicenow_service_account-get-question-choices",
});
