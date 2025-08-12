import app from "../../launch_darkly_oauth.app.mjs";
import common from "@pipedream/launchdarkly/actions/list-feature-flags/list-feature-flags.mjs";

import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, app);

export default {
  ...others,
  key: "launch_darkly_oauth-list-feature-flags",
  version: "0.0.1",
  name,
  description,
  type,
  props: {
    app,
    ...props,
  },
};
