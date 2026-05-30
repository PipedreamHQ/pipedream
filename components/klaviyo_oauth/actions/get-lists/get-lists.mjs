import app from "../../klaviyo_oauth.app.mjs";
import common from "@pipedream/klaviyo/actions/get-lists/get-lists.mjs";

import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, app);

export default {
  ...others,
  key: "klaviyo_oauth-get-lists",
  version: "0.0.1",
  name,
  description,
  type,
  props: {
    klaviyo: app,
    ...props,
  },
};
