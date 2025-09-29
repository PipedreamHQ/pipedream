import component from "@pipedream/slack/actions/get-file/get-file.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */

export default {
  ...component,
  props: utils.buildAppProps({
    component,
  }),
  key: "slack_bot-get-file",
  description: "Return information about a file (Bot). [See the documentation](https://api.slack.com/methods/files.info)",
  version: "0.0.5",
};
