import action from "@pipedream/servicenow/actions/get-article/get-article.mjs";
import { wrapAction } from "../../common/utils.mjs";

export default wrapAction(action);
