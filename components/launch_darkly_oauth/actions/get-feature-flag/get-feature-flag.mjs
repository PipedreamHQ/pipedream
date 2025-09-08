import app from "../../launch_darkly_oauth.app.mjs";
import common from "@pipedream/launchdarkly/actions/get-feature-flag/get-feature-flag.mjs";

import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, app);

export default {
  ...others,
  key: "launch_darkly_oauth-get-feature-flag",
  version: "0.0.1",
  name,
  description,
  type,
  props: {
    app,
    ...props,
  },
};
