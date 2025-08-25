import component from "@pipedream/slack/actions/upload-file/upload-file.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */

export default {
  ...component,
  props: utils.buildAppProps({
    component,
  }),
  key: "slack_bot-upload-file",
  description: "Upload a file (Bot). [See the documentation](https://api.slack.com/methods/files.upload)",
  version: "0.0.6",
};
