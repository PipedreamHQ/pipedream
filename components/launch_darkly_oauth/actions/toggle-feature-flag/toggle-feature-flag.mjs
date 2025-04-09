import { adjustPropDefinitions } from "../../common/utils.mjs";
import component from "../../../launchdarkly/actions/toggle-feature-flag/toggle-feature-flag.mjs";
import app from "../../launch_darkly_oauth.app.mjs";

const {
  name, description, type, ...others
} = component;
const props = adjustPropDefinitions(others.props, app);

export default {
  ...component,
  key: "launch_darkly_oauth-toggle-feature-flag",
  version: "0.0.1",
  name,
  description,
  type,
  props: {
    app,
    ...props,
  },
};
