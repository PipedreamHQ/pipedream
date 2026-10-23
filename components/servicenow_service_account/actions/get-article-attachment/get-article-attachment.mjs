import action from "@pipedream/servicenow/actions/get-article-attachment/get-article-attachment.mjs";
import { wrapAction } from "../../common/utils.mjs";

export default wrapAction(action, {
  key: "servicenow_service_account-get-article-attachment",
});
