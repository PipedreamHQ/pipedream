import component from "../../../slack/actions/list-files/list-files.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */

export default {
  ...component,
  props: utils.buildAppProps({
    component,
  }),
  key: "slack_bot-list-files",
  description: "Return a list of files within a team (Bot). [See docs here](https://api.slack.com/methods/files.list)",
  version: "0.0.1",
};
