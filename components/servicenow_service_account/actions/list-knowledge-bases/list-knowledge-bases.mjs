import action from "@pipedream/servicenow/actions/list-knowledge-bases/list-knowledge-bases.mjs";
import { wrapAction } from "../../common/utils.mjs";

export default wrapAction(action, {
  key: "servicenow_service_account-list-knowledge-bases",
  version: "0.0.1",
});
