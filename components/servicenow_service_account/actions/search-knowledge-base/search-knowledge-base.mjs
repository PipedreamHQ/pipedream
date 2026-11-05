import action from "@pipedream/servicenow/actions/search-knowledge-base/search-knowledge-base.mjs";
import { wrapAction } from "../../common/utils.mjs";

export default wrapAction(action, {
  key: "servicenow_service_account-search-knowledge-base",
  version: "0.0.1",
});
